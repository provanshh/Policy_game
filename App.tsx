import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ResourceState, GameStatus, Encounter, Choice, VictoryType, NPC, Passenger, ControlMode, Bullet, VehicleType, ThemeType, UserRole, PlayerProfile, Document, Transaction } from './types';
import { INITIAL_RESOURCES, PLAYER_SPEED, SCROLL_SPEED, FOOD_DRAIN_RATE, WORLD_WIDTH, WORLD_HEIGHT, ROAD_TOP, ROAD_BOTTOM, INTERACTION_RANGE } from './constants';
import { ENCOUNTERS } from './data/gameData';
import GameCanvas from './components/GameCanvas';
import ChoiceModal from './components/ChoiceModal';
import UIOverlay from './components/UIOverlay';
import EndScreen from './components/EndScreen';
import TitleScreen from './components/TitleScreen';
import VehicleModal from './components/VehicleModal';
import LotteryModal from './components/LotteryModal';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import DocumentInventory from './components/DocumentInventory';
import ZyndPayModal from './components/ZyndPayModal';

// --- ENHANCED AUDIO ENGINE ---
let audioCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let ambientGain: GainNode | null = null;
let introGain: GainNode | null = null;
let isBgmPlaying = false;
let isIntroPlaying = false;

const BASE_INTRO_GAIN = 0.5;
const BASE_BGM_GAIN = 0.6;
const BASE_AMBIENT_GAIN = 0.6;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
};

const playSound = (type: 'select' | 'confirm' | 'trade' | 'collision' | 'move' | 'gameover' | 'victory' | 'hurt' | 'onboard' | 'type' | 'shoot' | 'impact' | 'coin' | 'money' | 'spin' | 'win') => {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  const createOsc = (freq: number, type: OscillatorType, startTime: number, duration: number, gainValue: number) => {
    const osc = audioCtx!.createOscillator();
    const gain = audioCtx!.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(gainValue, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx!.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  switch (type) {
    case 'spin':
      createOsc(220 + Math.random() * 220, 'sawtooth', now, 0.05, 0.05);
      break;
    case 'win':
      [523, 659, 783, 1046].forEach((f, i) => createOsc(f, 'sine', now + i * 0.1, 0.4, 0.1));
      break;
    case 'coin':
      createOsc(987.77, 'sine', now, 0.1, 0.15);
      createOsc(1318.51, 'sine', now + 0.05, 0.15, 0.15);
      break;
    case 'money':
      for (let i = 0; i < 4; i++) {
        createOsc(1500 + Math.random() * 2000, 'triangle', now + i * 0.04, 0.1, 0.1);
      }
      break;
    case 'shoot':
      const shootOsc = audioCtx.createOscillator();
      const shootGain = audioCtx.createGain();
      shootOsc.type = 'sawtooth';
      shootOsc.frequency.setValueAtTime(440, now);
      shootOsc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      shootGain.gain.setValueAtTime(0.1, now);
      shootGain.gain.linearRampToValueAtTime(0, now + 0.15);
      shootOsc.connect(shootGain);
      shootGain.connect(audioCtx.destination);
      shootOsc.start(now);
      shootOsc.stop(now + 0.15);
      break;
    case 'impact':
      const impactOsc = audioCtx.createOscillator();
      const impactGain = audioCtx.createGain();
      impactOsc.type = 'square';
      impactOsc.frequency.setValueAtTime(120, now);
      impactOsc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
      impactGain.gain.setValueAtTime(0.1, now);
      impactGain.gain.linearRampToValueAtTime(0, now + 0.1);
      impactOsc.connect(impactGain);
      impactGain.connect(audioCtx.destination);
      impactOsc.start(now);
      impactOsc.stop(now + 0.1);
      break;
    case 'type':
      createOsc(200 + Math.random() * 50, 'triangle', now, 0.03, 0.015);
      break;
    case 'onboard':
      createOsc(440, 'triangle', now, 0.3, 0.2);
      break;
    case 'select':
      createOsc(440, 'square', now, 0.1, 0.1);
      break;
    case 'confirm':
      createOsc(523.25, 'triangle', now, 0.2, 0.2);
      break;
    case 'trade':
      [440, 554, 659].forEach((f, i) => createOsc(f, 'sawtooth', now + i * 0.05, 0.2, 0.05));
      break;
    case 'collision':
      createOsc(100, 'square', now, 0.3, 0.1);
      break;
    case 'hurt':
      createOsc(80, 'sawtooth', now, 0.5, 0.2);
      break;
    case 'gameover':
      createOsc(120, 'sawtooth', now, 1.5, 0.3);
      break;
    case 'victory':
      [523, 659, 783, 1046, 1318].forEach((f, i) => createOsc(f, 'triangle', now + i * 0.1, 0.6, 0.1));
      break;
  }
};

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>('authenticated');
  const [controlMode, setControlMode] = useState<ControlMode>('caravan');
  const [theme, setTheme] = useState<ThemeType>('desert');
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [victoryType, setVictoryType] = useState<VictoryType | null>(null);
  const [resources, setResources] = useState<ResourceState>(INITIAL_RESOURCES);
  const [playerPos, setPlayerPos] = useState({ x: 200, y: 300 });
  const [personPos, setPersonPos] = useState({ x: 200, y: 300 });
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);
  const [lastChoiceResult, setLastChoiceResult] = useState<string | null>(null);
  const [flags, setFlags] = useState<Set<string>>(new Set());
  const [pendingAction, setPendingAction] = useState<'continue_journey' | 'end_journey' | 'remove_passenger' | null>(null);
  const [notifications, setNotifications] = useState<{ id: number, message: string }[]>([]);
  const [replacementTarget, setReplacementTarget] = useState<Passenger | null>(null);
  const [showDocs, setShowDocs] = useState(false);
  const [showPay, setShowPay] = useState(false);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [ambientVolume, setAmbientVolume] = useState(0.5);
  const [isMouseControlEnabled, setIsMouseControlEnabled] = useState(false);

  const keys = useRef<Set<string>>(new Set());
  const requestRef = useRef<number>();
  const spawnTimer = useRef<number>(0);
  const mousePos = useRef({ x: 200, y: 300 });

  useEffect(() => {
    if (audioCtx) {
      if (bgmGain) bgmGain.gain.setTargetAtTime(BASE_BGM_GAIN * musicVolume * (isPaused || showSettings ? 0.05 : 0.15), audioCtx.currentTime, 0.1);
      if (introGain) introGain.gain.setTargetAtTime(BASE_INTRO_GAIN * musicVolume * 0.15, audioCtx.currentTime, 0.1);
      if (ambientGain) ambientGain.gain.setTargetAtTime(BASE_AMBIENT_GAIN * ambientVolume * (isPaused || showSettings ? 0.05 : 0.2), audioCtx.currentTime, 0.1);
    }
  }, [musicVolume, ambientVolume, isPaused, showSettings]);

  const startIntroMusic = useCallback(() => {
    if (isIntroPlaying || !audioCtx) return;
    isIntroPlaying = true;
    introGain = audioCtx.createGain();
    introGain.gain.setValueAtTime(0, audioCtx.currentTime);
    introGain.gain.linearRampToValueAtTime(BASE_INTRO_GAIN * musicVolume * 0.15, audioCtx.currentTime + 2);
    introGain.connect(audioCtx.destination);
    const notes = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
    let i = 0;
    const play = () => {
      if (!isIntroPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[i % notes.length], now);
      const env = audioCtx.createGain();
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(0.1, now + 0.1);
      env.gain.exponentialRampToValueAtTime(0.001, now + 2);
      osc.connect(env); env.connect(introGain!);
      osc.start(); osc.stop(now + 2);
      i++;
      setTimeout(play, 1500);
    };
    play();
  }, [musicVolume]);

  const startBGM = useCallback(() => {
    if (isBgmPlaying || !audioCtx) return;
    isBgmPlaying = true;
    bgmGain = audioCtx.createGain();
    bgmGain.gain.setValueAtTime(0, audioCtx.currentTime);
    bgmGain.gain.linearRampToValueAtTime(BASE_BGM_GAIN * musicVolume * 0.15, audioCtx.currentTime + 3);
    bgmGain.connect(audioCtx.destination);
    let step = 0;
    const loop = () => {
      if (!isBgmPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;
      if (step % 4 === 0) {
        const kOsc = audioCtx.createOscillator();
        kOsc.frequency.setValueAtTime(150, now);
        kOsc.frequency.exponentialRampToValueAtTime(0.01, now + 0.1);
        const kEnv = audioCtx.createGain();
        kEnv.gain.setValueAtTime(0.2, now);
        kEnv.gain.linearRampToValueAtTime(0, now + 0.1);
        kOsc.connect(kEnv); kEnv.connect(bgmGain!);
        kOsc.start(); kOsc.stop(now + 0.1);
      }
      step++;
      setTimeout(loop, 220);
    };
    loop();
  }, [musicVolume]);

  const startAmbient = useCallback(() => {
    if (ambientGain || !audioCtx) return;
    ambientGain = audioCtx.createGain();
    ambientGain.gain.setValueAtTime(0, audioCtx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(BASE_AMBIENT_GAIN * ambientVolume * 0.2, audioCtx.currentTime + 2);
    ambientGain.connect(audioCtx.destination);
  }, [ambientVolume]);

  const stopAllAudio = () => {
    isBgmPlaying = false;
    isIntroPlaying = false;
    if (bgmGain) { bgmGain.gain.linearRampToValueAtTime(0, audioCtx!.currentTime + 1); bgmGain = null; }
    if (ambientGain) { ambientGain.gain.linearRampToValueAtTime(0, audioCtx!.currentTime + 1); ambientGain = null; }
    if (introGain) { introGain.gain.linearRampToValueAtTime(0, audioCtx!.currentTime + 1); introGain = null; }
  };

  const handleInitAudio = () => { initAudio(); startIntroMusic(); };

  const startGame = (chosenTheme: ThemeType, role?: UserRole) => {
    initAudio(); stopAllAudio(); startAmbient(); startBGM();
    playSound('confirm');
    setTheme(chosenTheme);

    const initialWithRole: ResourceState = {
      ...INITIAL_RESOURCES,
      gold: role?.initialCredits ?? INITIAL_RESOURCES.gold,
      food: role?.initialEnergy ?? INITIAL_RESOURCES.food,
      reputation: role?.initialTrust ?? INITIAL_RESOURCES.reputation,
      selectedRole: role,
      monthsElapsed: 0,
      playerProfile: resources.playerProfile,
      documents: INITIAL_RESOURCES.documents
    };

    setResources(initialWithRole);
    setPlayerPos({ x: 200, y: 300 });
    setPersonPos({ x: 200, y: 300 });
    setControlMode('caravan');
    setNpcs([]); setBullets([]); setScrollOffset(0);
    setFlags(new Set()); setVictoryType(null);
    setIsPaused(false); setShowSettings(false); setStatus('dashboard'); setNotifications([]);

    // Welcome message
    addNotification(`System Initialized: ${role?.name ?? 'Standard'} Protocol.`);
  };

  const handleAuthComplete = (profile: PlayerProfile) => {
    setResources(prev => ({ ...prev, playerProfile: profile }));
    setStatus('role_select');
  };

  const updateDocumentStatus = (docId: string, statusText: Document['status']) => {
    setResources(prev => ({
      ...prev,
      documents: prev.documents.map(d => d.id === docId ? { ...d, status: statusText } : d),
      monthsElapsed: Math.min(12, prev.monthsElapsed + 1)
    }));
    addNotification("Inventory Protocol Updated. Month advanced.");
  };

  const handlePaymentSuccess = (tokens: number, tx: Transaction) => {
    setResources(prev => ({
      ...prev,
      playerProfile: prev.playerProfile ? {
        ...prev.playerProfile,
        advisoryTokens: prev.playerProfile.advisoryTokens + tokens,
        transactions: [tx, ...(prev.playerProfile.transactions || [])]
      } : undefined
    }));
    addNotification(`Payment Verified. ${tokens} Tokens Credited.`);
  };

  const addNotification = (message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const spawnNPC = useCallback(() => {
    const rand = Math.random();
    let type: NPC['type'] = 'terminal';
    let eId = '';
    let passenger: Passenger | undefined;

    if (rand < 0.12) {
      type = 'mystery_box'; eId = 'mystery';
    } else if (rand < 0.28) {
      type = 'coin'; eId = Math.random() < 0.1 ? 'big_coin' : 'small_coin';
    } else if (rand < 0.55 && resources.progress < 90) {
      type = 'agent';
      const pType = Array.from(['merchant', 'cook', 'scholar', 'guard'])[Math.floor(Math.random() * 4)] as Passenger['type'];
      const agentNum = resources.passengers.length + 1;
      passenger = { id: Math.random().toString(), name: `Agent ${agentNum}`, type: pType, bonusText: "Ready for advocacy" };
    } else {
      const pool = Object.keys(ENCOUNTERS).filter(key => key !== 'waystation' && key !== 'haven_checkpoint');
      eId = pool[Math.floor(Math.random() * pool.length)];
      if (resources.progress > 45 && resources.progress < 55) eId = 'waystation';
      if (resources.progress >= 95) eId = 'haven_checkpoint';
      type = (eId === 'haven_checkpoint' ? 'haven' : 'terminal');
    }
    const newNpc: NPC = {
      id: Math.random().toString(), x: WORLD_WIDTH + 100,
      y: ROAD_TOP + Math.random() * (ROAD_BOTTOM - ROAD_TOP - 40),
      type: type as any, encounterId: eId, width: type === 'coin' || type === 'mystery_box' ? 32 : 48, height: type === 'coin' || type === 'mystery_box' ? 32 : 48,
      speedMultiplier: 0.5 + Math.random() * 0.5, passengerData: passenger
    };
    setNpcs(prev => [...prev, newNpc]);
  }, [resources.progress, resources.passengers.length]);

  const generatePassengerTradeEncounter = (): Encounter => {
    const choices: Choice[] = resources.passengers.map((p) => {
      let c: Choice = { id: `trade_${p.id}`, text: `Sync with ${p.name}`, consequenceText: "Data sync complete.", color: 'bg-emerald-700' };
      if (p.type === 'merchant') { c.text = `Exchange 15 Trust for 60 Credits`; c.reputationCost = 15; c.goldGain = 60; c.color = 'bg-yellow-700'; }
      else if (p.type === 'cook') { c.text = `Policy Buff (20 Credits -> 40 Energy)`; c.goldCost = 20; c.foodGain = 40; c.color = 'bg-orange-700'; }
      else if (p.type === 'scholar') { c.text = `Submit Audit (30 Credits -> 25 Trust)`; c.goldCost = 30; c.reputationGain = 25; c.color = 'bg-indigo-700'; }
      else if (p.type === 'guard') { c.text = `Training (10 Energy -> 10 Trust)`; c.foodCost = 10; c.reputationGain = 10; c.color = 'bg-slate-700'; }
      return c;
    });
    return {
      id: 'passenger_trade', title: 'AGENT NETWORK SYNC',
      description: 'Your agents are ready to optimize. "Ready for command, Navigator."',
      icon: '🤝', choices: choices.length > 0 ? choices : [{ id: 'no_pass', text: 'Empty clusters...', consequenceText: 'No agents available.', color: 'bg-stone-800' }]
    };
  };

  const generateSynergyEncounter = (): Encounter => {
    const hasType = (t: Passenger['type']) => resources.passengers.some(p => p.type === t);
    const choices: Choice[] = [];

    if (hasType('merchant') && hasType('cook')) {
      choices.push({
        id: 'syn_match_interp',
        text: 'The Optimization Protocol (Matcher + Interpreter)',
        consequenceText: 'Strategic allocation reduces system overhead. Credits converted to massive Energy.',
        goldCost: 20, foodGain: 55, color: 'bg-emerald-600'
      });
    }
    if (hasType('scholar') && hasType('guard')) {
      choices.push({
        id: 'syn_verif_advoc',
        text: 'Legitimacy Assurance (Verifier + Advocate)',
        consequenceText: 'Verified advocacy increases system credibility. High Trust gain.',
        foodCost: 25, reputationGain: 45, color: 'bg-indigo-600'
      });
    }
    if (hasType('merchant') && hasType('scholar')) {
      choices.push({
        id: 'syn_match_verif',
        text: 'Audit-Compliant Funding (Matcher + Verifier)',
        consequenceText: 'Elite targeting unlocks premium grants. Energy converted to Credits and Trust.',
        foodCost: 20, goldGain: 50, reputationGain: 25, color: 'bg-cyan-600'
      });
    }
    if (hasType('guard') && hasType('cook')) {
      choices.push({
        id: 'syn_advoc_interp',
        text: 'Community Resilience Matrix (Advocate + Interpreter)',
        consequenceText: 'Deep field outreach stabilizes the network. Massive Trust gain.',
        foodCost: 35, reputationGain: 80, color: 'bg-rose-600'
      });
    }
    if (hasType('merchant') && hasType('guard')) {
      choices.push({
        id: 'syn_match_advoc',
        text: 'Resource Protection Initiative (Matcher + Advocate)',
        consequenceText: 'Securing the budget through active advocacy. Small Credit spend for massive Trust.',
        goldCost: 40, reputationGain: 60, color: 'bg-teal-600'
      });
    }
    if (hasType('cook') && hasType('scholar')) {
      choices.push({
        id: 'syn_interp_verif',
        text: 'Logic-Gated Eligibility (Interpreter + Verifier)',
        consequenceText: 'Streamlined verification protocols. Credits converted to critical Energy.',
        goldCost: 40, foodGain: 90, color: 'bg-amber-600'
      });
    }

    if (choices.length === 0) {
      choices.push({
        id: 'no_synergy',
        text: 'Basic Outreach Sync',
        consequenceText: 'The network is too fragmented for complex synergies. Core system recalibrated.',
        foodGain: 15, color: 'bg-stone-500'
      });
    }

    return {
      id: 'synergy_discovery',
      title: 'COLLECTIVE OPPORTUNITY DISCOVERED',
      description: 'Your agents intersect in the field, revealing synergy pathways uniquely available to your current cluster configuration.',
      icon: '🧬',
      choices: choices.length > 3 ? choices.slice(0, 3) : choices // Keep it focused
    };
  };

  const generateReplacementEncounter = (newPass: Passenger): Encounter => {
    return {
      id: 'passenger_replacement',
      title: 'NETWORK OPTIMIZATION',
      description: `Target ${newPass.type.toUpperCase()} offers 50 CREDITS to join your cluster and replace an existing agent. "I have higher advocacy throughput, Navigator."`,
      icon: '💰',
      choices: [
        {
          id: 'confirm_replacement',
          text: 'Accept Allocation (50C) & Replace Agent',
          consequenceText: 'Optimization complete.',
          color: 'bg-yellow-600',
          goldGain: 50
        },
        {
          id: 'cancel_replacement',
          text: 'No, maintain existing cluster.',
          consequenceText: 'The agent returns to the pool.',
          color: 'bg-stone-600'
        }
      ]
    };
  };

  const gameLoop = useCallback(() => {
    if (status !== 'playing' || isPaused || showSettings) { requestRef.current = requestAnimationFrame(gameLoop); return; }
    let vSpeedMult = 1.0, vFoodMult = 1.0;
    switch (resources.vehicle) {
      case 'bike': vSpeedMult = 1.4; vFoodMult = 0.8; break;
      case 'car': vSpeedMult = 1.2; vFoodMult = 1.0; break;
      case 'truck': vSpeedMult = 0.8; vFoodMult = 1.2; break;
      case 'train': vSpeedMult = 1.6; vFoodMult = 1.8; break;
    }
    const currentSpeed = PLAYER_SPEED * vSpeedMult * (flags.has('speed_upgrade') ? 1.4 : 1.0);

    if (controlMode === 'person') {
      setPersonPos(prev => {
        let nx = prev.x, ny = prev.y;
        if (isMouseControlEnabled) {
          const tx = mousePos.current.x;
          const ty = mousePos.current.y;
          nx += (tx - prev.x) * 0.15;
          ny += (ty - prev.y) * 0.15;
        } else {
          if (keys.current.has('w') || keys.current.has('arrowup')) ny -= PLAYER_SPEED * 1.2;
          if (keys.current.has('s') || keys.current.has('arrowdown')) ny += PLAYER_SPEED * 1.2;
          if (keys.current.has('a') || keys.current.has('arrowleft')) nx -= PLAYER_SPEED * 1.2;
          if (keys.current.has('d') || keys.current.has('arrowright')) nx += PLAYER_SPEED * 1.2;
        }
        return { x: Math.max(0, Math.min(WORLD_WIDTH, nx)), y: Math.max(0, Math.min(WORLD_HEIGHT, ny)) };
      });

      setBullets(prev => {
        const next = prev.map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy }))
          .filter(b => b.x > 0 && b.x < WORLD_WIDTH && b.y > 0 && b.y < WORLD_HEIGHT);

        let hitNpcId: string | null = null;
        let bulletIdToRemove: string | null = null;

        for (const bullet of next) {
          const hit = npcs.find(n => (n.type !== 'coin' && n.type !== 'haven' && n.type !== 'mystery_box') &&
            Math.abs(n.x - bullet.x) < 30 && Math.abs(n.y - bullet.y) < 30);
          if (hit) {
            hitNpcId = hit.id;
            bulletIdToRemove = bullet.id;
            break;
          }
        }

        if (hitNpcId) {
          playSound('impact');
          const hitNpc = npcs.find(n => n.id === hitNpcId);

          if (hitNpc && (hitNpc.type === 'person' || hitNpc.type === 'agent') && hitNpc.passengerData) {
            // Force-onboard the agent
            setResources(prev => {
              const cap = flags.has('capacity_upgrade') ? 5 : 3;
              let nextPass = [...prev.passengers];
              if (nextPass.length < cap) {
                nextPass.push({ ...hitNpc.passengerData!, name: `Agent ${nextPass.length + 1}` });
              } else {
                const replaceIdx = Math.floor(Math.random() * nextPass.length);
                nextPass[replaceIdx] = { ...hitNpc.passengerData!, name: `Agent ${replaceIdx + 1} (Sync)` };
              }
              return { ...prev, passengers: nextPass, gold: prev.gold + 10 };
            });
            addNotification("Agent Force-Sync Complete. Units Updated.");
          } else if (hitNpc && hitNpc.type === 'terminal') {
            // Scramble one agent
            setResources(prev => {
              if (prev.passengers.length === 0) return { ...prev, gold: Math.max(0, prev.gold - 5) };
              const nextPass = [...prev.passengers];
              const replaceIdx = Math.floor(Math.random() * nextPass.length);
              const pTypes: Passenger['type'][] = ['merchant', 'cook', 'scholar', 'guard'];
              const newType = pTypes[Math.floor(Math.random() * pTypes.length)];
              nextPass[replaceIdx] = {
                id: Math.random().toString(),
                name: `Agent ${replaceIdx + 1} (Glitched)`,
                type: newType,
                bonusText: "Data scramble"
              };
              return { ...prev, passengers: nextPass, gold: Math.max(0, prev.gold - 5) };
            });
            addNotification("Terminal Glitch! Agent Cluster Scrambled.");
          } else {
            setResources(r => ({ ...r, gold: Math.max(0, r.gold - 5) }));
            addNotification("Collateral damage detected. Credits penalized.");
          }

          setNpcs(n => n.filter(npc => npc.id !== hitNpcId));
          return next.filter(b => b.id !== bulletIdToRemove);
        }

        return next;
      });
    } else {
      setPlayerPos(prev => {
        let nx = prev.x, ny = prev.y;

        if (isMouseControlEnabled) {
          const targetX = mousePos.current.x;
          const targetY = mousePos.current.y;
          nx += (targetX - prev.x) * 0.1;
          ny += (targetY - prev.y) * 0.1;
        } else {
          if (keys.current.has('w') || keys.current.has('arrowup')) ny -= currentSpeed;
          if (keys.current.has('s') || keys.current.has('arrowdown')) ny += currentSpeed;
          if (keys.current.has('a') || keys.current.has('arrowleft')) nx -= currentSpeed;
          if (keys.current.has('d') || keys.current.has('arrowright')) nx += currentSpeed;
        }

        return { x: Math.max(50, Math.min(WORLD_WIDTH - 50, nx)), y: Math.max(ROAD_TOP + 20, Math.min(ROAD_BOTTOM - 20, ny)) };
      });
      setResources(prev => {
        const isMoving = keys.current.size > 0 || isMouseControlEnabled;
        let drain = (isMoving ? FOOD_DRAIN_RATE * 2 : FOOD_DRAIN_RATE) * vFoodMult;
        if (prev.passengers.some(p => p.type === 'cook')) drain *= 0.8;
        if (flags.has('efficiency_upgrade')) drain *= 0.75;
        let nextFood = Math.max(0, prev.food - drain);
        let nextLives = prev.lives;
        if (nextFood <= 0) { if (nextLives > 1) { playSound('hurt'); nextLives -= 1; nextFood = 50; } else { playSound('gameover'); setStatus('gameover'); stopAllAudio(); } }
        const nextProgress = Math.min(100, prev.progress + ((SCROLL_SPEED * vSpeedMult) / 80));
        const nextMonth = Math.min(12, (nextProgress / 100) * 12);
        if (Math.floor(nextMonth) > Math.floor(prev.monthsElapsed) && nextMonth < 12) {
          addNotification(`Month ${Math.floor(nextMonth) + 1} Initiated. Auditing Cluster...`);
        }
        if (nextMonth >= 12 && status === 'playing') {
          setStatus('victory');
          setVictoryType('peace');
          stopAllAudio();
        }
        return { ...prev, food: nextFood, lives: nextLives, progress: nextProgress, monthsElapsed: nextMonth };
      });
      setScrollOffset(prev => (prev + SCROLL_SPEED * vSpeedMult) % 100);
      setNpcs(prev => {
        const updated = prev.map(n => ({ ...n, x: n.x - SCROLL_SPEED * vSpeedMult * n.speedMultiplier })).filter(n => n.x > -150);

        const coinIdx = updated.findIndex(n => n.type === 'coin' && Math.abs(n.x - playerPos.x) < 35 && Math.abs(n.y - playerPos.y) < 35);
        if (coinIdx !== -1) { playSound('coin'); setResources(r => ({ ...r, gold: r.gold + (updated[coinIdx].encounterId === 'big_coin' ? 25 : 5) })); return updated.filter((_, i) => i !== coinIdx); }

        const mysteryIdx = updated.findIndex(n => n.type === 'mystery_box' && Math.abs(n.x - playerPos.x) < 35 && Math.abs(n.y - playerPos.y) < 35);
        if (mysteryIdx !== -1) { playSound('confirm'); setStatus('lottery'); return updated.filter((_, i) => i !== mysteryIdx); }

        const agentHitIdx = updated.findIndex(n => (n.type === 'agent' || n.type === 'person') && Math.abs(n.x - playerPos.x) < 45 && Math.abs(n.y - playerPos.y) < 45);
        if (agentHitIdx !== -1) { playSound('confirm'); setActiveEncounter(generateSynergyEncounter()); setStatus('encounter'); return updated.filter((_, i) => i !== agentHitIdx); }

        const hit = updated.find(n => n.type !== 'person' && n.type !== 'agent' && n.type !== 'coin' && n.type !== 'mystery_box' && Math.abs(n.x - playerPos.x) < 45 && Math.abs(n.y - playerPos.y) < 45);
        if (hit) { playSound('collision'); setActiveEncounter(ENCOUNTERS[hit.encounterId]); setStatus('encounter'); return updated.filter(n => n.id !== hit.id); }
        return updated;
      });

      spawnTimer.current += 16;
      if (spawnTimer.current > 1000 && resources.progress < 95) { spawnNPC(); spawnTimer.current = 0; }
    }
    requestRef.current = requestAnimationFrame(gameLoop);
  }, [status, playerPos, personPos, controlMode, npcs, spawnNPC, isPaused, showSettings, flags, resources.vehicle, resources.food, resources.lives, resources.progress, resources.passengers, isMouseControlEnabled]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameLoop]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (status === 'playing' && controlMode === 'person') {
        playSound('shoot');
        const speed = 12;
        const bullet: Bullet = {
          id: Math.random().toString(),
          x: personPos.x + 10,
          y: personPos.y - 8,
          vx: speed,
          vy: 0
        };
        setBullets(prev => [...prev, bullet]);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('svg')?.getBoundingClientRect();
      if (rect) {
        const rx = ((e.clientX - rect.left) / rect.width) * WORLD_WIDTH;
        const ry = ((e.clientY - rect.top) / rect.height) * WORLD_HEIGHT;
        mousePos.current = { x: rx, y: ry };
      }
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [status, controlMode, personPos]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === 'f') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          });
        } else {
          document.exitFullscreen();
        }
        playSound('select');
        return;
      }

      if (key === 's' && status === 'playing') {
        setShowSettings(prev => !prev);
        playSound('select');
        return;
      }

      if (key === 'escape' || (key === ' ' && status === 'playing' && !activeEncounter)) {
        if (showSettings) {
          setShowSettings(false);
        } else if (status === 'vehicle_select') {
          setStatus('playing');
        } else if (status === 'playing' || status === 'lottery') {
          setStatus('playing');
          if (status === 'playing') setIsPaused(prev => !prev);
        }
        playSound('select');
        return;
      }

      if (key === 'p' && status === 'playing' && controlMode === 'caravan') {
        setActiveEncounter(generatePassengerTradeEncounter()); setStatus('encounter'); addNotification("Syncing with agent network"); playSound('select'); return;
      }
      if (key === 'p' && status === 'encounter' && activeEncounter?.id === 'passenger_trade') { closeEncounter(); playSound('select'); return; }
      if (key === 'v' && status === 'playing' && controlMode === 'caravan') { setStatus('vehicle_select'); playSound('select'); return; }
      if (key === 't' && status === 'playing' && controlMode === 'caravan') {
        const traderPool = ['encryption_specialist', 'legitimacy_authenticator', 'resource_governance_chief', 'grant_allocation_node', 'system_architect', 'stranded_beneficiary'];
        setActiveEncounter(ENCOUNTERS[traderPool[Math.floor(Math.random() * traderPool.length)]]); setStatus('encounter'); playSound('confirm'); return;
      }
      if (key === 'c' && status === 'playing') {
        if (controlMode === 'caravan') { playSound('onboard'); setControlMode('person'); setPersonPos({ x: playerPos.x, y: playerPos.y }); setBullets([]); }
        else if (Math.sqrt(Math.pow(personPos.x - playerPos.x, 2) + Math.pow(personPos.y - playerPos.y, 2)) < 80) { playSound('confirm'); setControlMode('caravan'); setBullets([]); }
        return;
      }
      keys.current.add(key);
      if (status === 'playing' && key === 'e' && controlMode === 'caravan') {
        const idx = npcs.findIndex(n => (n.type === 'agent' || n.type === 'person') && Math.abs(n.x - playerPos.x) < INTERACTION_RANGE);
        if (idx !== -1) {
          const cap = flags.has('capacity_upgrade') ? 5 : 3;
          const targetPass = npcs[idx].passengerData!;
          if (resources.passengers.length < cap) {
            playSound('onboard'); playSound('coin');
            setResources(prev => ({ ...prev, passengers: [...prev.passengers, targetPass], gold: prev.gold + 20 }));
            addNotification(`Agent ${resources.passengers.length + 1} Onboarded. Processing Grant: 20C`);
            setNpcs(prev => prev.filter((_, i) => i !== idx));
          } else {
            setReplacementTarget(targetPass);
            setNpcs(prev => prev.filter((_, i) => i !== idx));
            setActiveEncounter(generateReplacementEncounter(targetPass));
            setStatus('encounter');
            playSound('select');
          }
        }
      }
      if (status === 'encounter' && activeEncounter && !lastChoiceResult) {
        const num = parseInt(key);
        if (!isNaN(num) && num > 0 && num <= activeEncounter.choices.length) handleChoice(activeEncounter.choices[num - 1]);
      } else if (status === 'encounter' && lastChoiceResult && (key === ' ' || key === 'enter')) { playSound('confirm'); closeEncounter(); }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener('keydown', down); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [status, isPaused, showSettings, activeEncounter, lastChoiceResult, npcs, playerPos, personPos, controlMode, flags, resources.passengers]);

  const handleChoice = (choice: Choice) => {
    if (choice.advisoryTokenCost && (!resources.playerProfile || resources.playerProfile.advisoryTokens < choice.advisoryTokenCost)) {
      addNotification("Insufficient Advisory Tokens. Reload via Zynd Pay.");
      return;
    }
    playSound('money');

    // Probability / Rejection Engine
    let isApproved = true;
    if (choice.probability !== undefined) {
      isApproved = Math.random() < (choice.probability / 100);
    }

    if (!isApproved) {
      setResources(prev => ({
        ...prev,
        reputation: Math.max(0, prev.reputation - 10),
        food: Math.max(0, prev.food - (choice.foodCost || 0)),
        gold: Math.max(0, prev.gold - (choice.goldCost || 0)),
        playerProfile: prev.playerProfile ? {
          ...prev.playerProfile,
          advisoryTokens: prev.playerProfile.advisoryTokens - (choice.advisoryTokenCost || 0)
        } : undefined
      }));
      setLastChoiceResult(`APPLICATION REJECTED: "Your parameters did not meet sector requirements." - Policy Agent. You lost 10 TRUST.`);
      addNotification("Rejection Analyzed. Policy gap detected.");
      return;
    }

    if (choice.id === 'confirm_replacement' && replacementTarget) {
      setResources(prev => {
        const nextPass = [...prev.passengers];
        nextPass.splice(Math.floor(Math.random() * nextPass.length), 1);
        nextPass.push({ ...replacementTarget, name: `Agent ${nextPass.length + 1}` });
        return {
          ...prev,
          passengers: nextPass,
          gold: prev.gold + 50,
          playerProfile: prev.playerProfile ? {
            ...prev.playerProfile,
            advisoryTokens: prev.playerProfile.advisoryTokens - (choice.advisoryTokenCost || 0)
          } : undefined
        };
      });
      addNotification("Optimization successful. 50 Credits received.");
    }
    setResources(prev => ({
      ...prev,
      food: Math.max(0, Math.min(100, prev.food - (choice.foodCost || 0) + (choice.foodGain || 0))),
      gold: Math.max(0, prev.gold - (choice.goldCost || 0) + (choice.goldGain || 0)),
      reputation: Math.max(0, prev.reputation - (choice.reputationCost || 0) + (choice.reputationGain || 0)),
      lives: Math.min(3, prev.lives + (choice.id === 'mend_spirit' && prev.reputation >= 30 ? 1 : 0)),
      playerProfile: prev.playerProfile ? {
        ...prev.playerProfile,
        advisoryTokens: prev.playerProfile.advisoryTokens - (choice.advisoryTokenCost || 0)
      } : undefined
    }));
    if (choice.flagToSet) setFlags(prev => new Set(prev).add(choice.flagToSet!));
    if (choice.action) setPendingAction(choice.action);
    setLastChoiceResult(choice.consequenceText);
  };

  const handleLotteryReward = (reward: any) => {
    playSound('money');
    // Calculate a trade value for the mystery reward
    const tradeValue = reward.gold || (reward.food ? 45 : reward.rep ? 35 : reward.lives ? 100 : 25);
    setResources(prev => ({
      ...prev,
      gold: prev.gold + tradeValue,
    }));
    addNotification("Data packet analyzed. Credits granted.");
    setStatus('playing');
  };

  const closeEncounter = () => {
    const action = pendingAction; setPendingAction(null); setActiveEncounter(null); setLastChoiceResult(null); setReplacementTarget(null);
    if (action === 'continue_journey') { setResources(prev => ({ ...prev, journeyCount: prev.journeyCount + 1, progress: 0 })); setNpcs([]); setStatus('playing'); }
    else if (action === 'end_journey') { setVictoryType('hero'); setStatus('victory'); stopAllAudio(); }
    else setStatus('playing');
  };

  const handleVehicleSelect = (v: VehicleType) => {
    const costs: Record<VehicleType, number> = { caravan: 0, bike: 50, car: 100, truck: 200, train: 500 };
    if (resources.gold >= costs[v] || v === resources.vehicle) {
      setResources(prev => ({ ...prev, vehicle: v, gold: v === prev.vehicle ? prev.gold : prev.gold - costs[v] }));
      setStatus('playing');
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#111] text-stone-100 overflow-hidden select-none">
      <GameCanvas playerPos={playerPos} personPos={personPos} controlMode={controlMode} npcs={npcs} bullets={bullets} scrollOffset={scrollOffset} status={status} progress={resources.progress} passengers={resources.passengers} vehicle={resources.vehicle} theme={theme} />
      {status !== 'title' && status !== 'gameover' && status !== 'victory' && (
        <UIOverlay
          resources={resources}
          flags={flags}
          musicVolume={musicVolume}
          ambientVolume={ambientVolume}
          isMouseControlEnabled={isMouseControlEnabled}
          onSetMusicVolume={setMusicVolume}
          onSetAmbientVolume={setAmbientVolume}
          onSetMouseControl={setIsMouseControlEnabled}
          onPlaySound={playSound}
          notifications={notifications}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />
      )}
      {status === 'title' && <TitleScreen onStart={(theme, role) => startGame(theme, role)} onInitAudio={handleInitAudio} onPlaySound={playSound} musicVolume={musicVolume} ambientVolume={ambientVolume} onSetMusicVolume={setMusicVolume} onSetAmbientVolume={setAmbientVolume} />}
      {status === 'authenticated' && <AuthScreen onComplete={handleAuthComplete} onPlaySound={playSound} />}
      {status === 'role_select' && <TitleScreen initialStep="role-selection" onStart={(theme, role) => startGame(theme, role)} onInitAudio={handleInitAudio} onPlaySound={playSound} musicVolume={musicVolume} ambientVolume={ambientVolume} onSetMusicVolume={setMusicVolume} onSetAmbientVolume={setAmbientVolume} />}
      {status === 'dashboard' && <Dashboard resources={resources} onStartLevel={() => setStatus('playing')} onViewDocs={() => setShowDocs(true)} onViewLeaderboard={() => { }} onBuyTokens={() => setShowPay(true)} onPlaySound={playSound} />}
      {showDocs && <DocumentInventory resources={resources} onClose={() => setShowDocs(false)} onPlaySound={playSound} onUpdateStatus={updateDocumentStatus} />}
      {showPay && <ZyndPayModal playerEmail={resources.playerProfile?.contact || 'GUEST'} playerState={resources.playerProfile?.state || 'Punjab'} playerRole={resources.selectedRole?.name || 'Citizen'} onSuccess={handlePaymentSuccess} onClose={() => setShowPay(false)} onPlaySound={playSound} />}
      {status === 'encounter' && activeEncounter && <ChoiceModal encounter={activeEncounter} onChoice={handleChoice} result={lastChoiceResult} onClose={closeEncounter} flags={flags} reputation={resources.reputation} passengers={resources.passengers} onBuyTokens={() => setShowPay(true)} onPlaySound={playSound} playerTokens={resources.playerProfile?.advisoryTokens || 0} />}
      {status === 'lottery' && <LotteryModal onComplete={handleLotteryReward} onClose={() => setStatus('playing')} onPlaySound={playSound} />}
      {status === 'vehicle_select' && <VehicleModal currentVehicle={resources.vehicle} onSelect={handleVehicleSelect} onClose={() => setStatus('playing')} onPlaySound={playSound} />}
      {(status === 'gameover' || status === 'victory') && <EndScreen status={status} victoryType={victoryType} resources={resources} onRestart={() => startGame(theme, resources.selectedRole)} onPlaySound={playSound} />}
      {isPaused && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center">
          <div className="mc-container p-12 text-center border-[8px] border-black space-y-8 relative">
            <h2 className="text-8xl font-black text-pixel text-white uppercase italic animate-pulse">PAUSED</h2>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setIsPaused(false); playSound('confirm'); }} className="mc-button text-4xl bg-emerald-600 border-emerald-400">RESUME [ESC/SPACE]</button>
              <button onClick={() => { setIsPaused(false); stopAllAudio(); setStatus('title'); startIntroMusic(); playSound('select'); }} className="mc-button text-3xl bg-red-800 border-red-600">ABANDON</button>
            </div>
          </div>

          <div className="absolute right-12 top-1/2 -translate-y-1/2 mc-container p-6 bg-[#c6c6c6] border-[6px] border-black w-72 shadow-2xl animate-in slide-in-from-right-10 flex flex-col gap-4">
            <h3 className="text-3xl font-black text-pixel text-stone-900 uppercase border-b-4 border-black/20 pb-2">SHORTCUT KEYS</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>MOVE</span>
                <kbd className="text-sm">W A S D</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>SETTINGS</span>
                <kbd className="text-sm">S</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>TRADE</span>
                <kbd className="text-sm">P</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>HANGAR</span>
                <kbd className="text-sm">V</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>VEHICLE</span>
                <kbd className="text-sm">C</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>ONBOARD</span>
                <kbd className="text-sm">E</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>FULLSCREEN</span>
                <kbd className="text-sm">F</kbd>
              </div>
              <div className="flex justify-between items-center text-stone-800 font-bold uppercase text-lg">
                <span>PAUSE</span>
                <kbd className="text-sm">SPACE</kbd>
              </div>
            </div>
            <p className="text-xs text-stone-600 italic font-bold text-center mt-2">Trade. Travel. Encounter.</p>
          </div>
        </div>
      )}
      {status === 'playing' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 bg-black/50 px-6 py-2 border-2 border-white/20 text-yellow-400 font-bold uppercase text-pixel tracking-widest pointer-events-none text-center">
          {controlMode === 'caravan' ? "PRESS [S] SETTINGS | [C] EXIT | [V] HANGAR | [P] AGENT NETWORK SYNC | [SPACE] PAUSE | [F] FULLSCREEN" : "LEFT CLICK SHOOT | WALK NEAR & [C] ENTER | [F] FULLSCREEN"}
        </div>
      )}
    </div>
  );
};

export default App;