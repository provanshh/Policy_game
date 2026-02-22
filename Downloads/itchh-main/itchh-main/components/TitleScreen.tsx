import React, { useState, useEffect, useRef } from 'react';
import { ThemeType, UserRole } from '../types';
import { USER_ROLES } from '../constants';

interface TitleScreenProps {
  onStart: (theme: ThemeType, role: UserRole) => void;
  onInitAudio: () => void;
  onPlaySound: (type: any) => void;
  musicVolume: number;
  ambientVolume: number;
  onSetMusicVolume: (v: number) => void;
  onSetAmbientVolume: (v: number) => void;
  initialStep?: 'title' | 'story' | 'role-selection' | 'theme-selection';
}

const THEMES: { id: ThemeType; name: string; icon: string; bg: string; road: string; desc: string }[] = [
  { id: 'desert', name: 'Golden Sands', icon: '🏜️', bg: '#55aa33', road: '#866043', desc: 'The classic wasteland experience.' },
  { id: 'neon', name: 'Synthwave Night', icon: '🌆', bg: '#0f0f1b', road: '#1a1a2e', desc: 'Retro-future neon highways.' },
  { id: 'frozen', name: 'Arctic Tundra', icon: '❄️', bg: '#f1f5f9', road: '#a5f3fc', desc: 'Slick roads and biting frost.' },
  { id: 'toxic', name: 'Toxic Swamp', icon: '☣️', bg: '#1a2e05', road: '#3f6212', desc: 'Radioactive fumes and acid paths.' },
];

const TitleScreen: React.FC<TitleScreenProps> = ({
  onStart, onInitAudio, onPlaySound,
  musicVolume, ambientVolume, onSetMusicVolume, onSetAmbientVolume, initialStep = 'title'
}) => {
  const [step, setStep] = useState<'title' | 'story' | 'role-selection' | 'theme-selection' | 'how-to' | 'settings'>(initialStep);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const storyLines = [
    "The year is 0x7E2. The Global Policy Network has fragmented.",
    "Bureaucracy is a maze, and vital benefits are lost in the noise.",
    "As a Policy Navigator, you are the last advocate for the citizens.",
    "But the wild is treacherous. Data auditors want your credits.",
    "The complexity of the policy landscape drains your energy.",
    "Will you reach the Benefit Haven and restore trust?",
    "Press the button to initialize advocacy protocols."
  ];

  useEffect(() => {
    if (step === 'story') {
      intervalRef.current = window.setInterval(() => {
        setLineIndex(prev => {
          if (prev < storyLines.length - 1) {
            const nextIndex = prev + 1;
            onPlaySound('type');
            return nextIndex;
          }
          if (intervalRef.current) clearInterval(intervalRef.current);
          return prev;
        });
      }, 2800);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [step, onPlaySound]);

  const handleBegin = () => {
    onInitAudio();
    onPlaySound('confirm');
    setStep('story');
    onPlaySound('type');
  };

  const handleSkip = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLineIndex(storyLines.length - 1);
    onPlaySound('select');
  };

  const handleStoryFinished = () => {
    onPlaySound('confirm');
    setStep('role-selection');
  };

  const handleRoleSelect = (role: UserRole) => {
    onPlaySound('confirm');
    setSelectedRole(role);
    setStep('theme-selection');
  };

  const handleHowTo = () => {
    onInitAudio();
    onPlaySound('select');
    setStep('how-to');
  };

  const handleSettings = () => {
    onInitAudio();
    onPlaySound('select');
    setStep('settings');
  };

  const handleBack = () => {
    onPlaySound('select');
    setStep('title');
  };

  const handleFinalStart = (theme: ThemeType) => {
    if (selectedRole) {
      onPlaySound('confirm');
      onStart(theme, selectedRole);
    }
  };

  const toggleInfo = () => {
    onPlaySound('select');
    setShowInfo(!showInfo);
  };

  if (step === 'title') {
    return (
      <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden p-4">
        <div className="absolute inset-0 bg-black">
          <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[radial-gradient(circle_at_20%_20%,_#f59e0b_0%,_transparent_50%),radial-gradient(circle_at_80%_80%,_#3b82f6_0%,_transparent_50%),radial-gradient(circle_at_50%_50%,_#10b981_0%,_transparent_100%)] animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-30" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-10 animate-[spin_60s_linear_infinite]" />
          </div>
        </div>

        <div className="absolute left-8 top-8 z-50">
          <button
            onClick={toggleInfo}
            onMouseEnter={() => onPlaySound('select')}
            className="mc-button w-14 h-14 text-2xl flex items-center justify-center bg-emerald-600 border-black"
          >
            ℹ️
          </button>
        </div>

        {showInfo && (
          <div className="absolute inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={toggleInfo}>
            <div
              className="mc-container p-8 text-center border-[6px] border-black space-y-4 max-w-lg bg-[#c6c6c6]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl md:text-4xl font-black text-pixel text-stone-900 uppercase">CREDITS</h2>
              <div className="h-1 bg-black/20 w-full" />
              <p className="text-xl md:text-2xl font-bold text-stone-800">
                Made by Team Phoenix <br />
                <span className="text-indigo-700">(Vansh Singla, Dev Garg)</span>
              </p>
              <p className="text-lg md:text-xl italic font-black text-emerald-700 uppercase tracking-widest text-pixel">
                Trade. Travel. Encounter.
              </p>
              <button
                onClick={toggleInfo}
                className="mc-button bg-stone-700 w-full mt-4 text-xl"
              >
                CLOSE
              </button>
            </div>
          </div>
        )}

        <div className="relative text-center space-y-6 md:space-y-10 animate-in fade-in duration-1000 z-10 w-full max-w-5xl">
          <div className="flex flex-col items-center">
            <div className="bg-[#55aa33] p-1 border-4 border-black mb-4 md:mb-6 shadow-2xl rotate-3 animate-bounce">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white border-4 border-black flex items-center justify-center text-4xl md:text-6xl">📦</div>
            </div>
            <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-black text-pixel text-white uppercase tracking-tighter italic drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] leading-[0.75] md:leading-[0.75]">
              POLICY <br /> <span className="text-yellow-400">NAVIGATOR</span>
            </h1>
            <p className="text-yellow-100/80 text-xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] mt-4 md:mt-6 uppercase font-black text-pixel">Ending Bureaucratic Opacity</p>
          </div>

          <div className="flex flex-col gap-4 md:gap-6 items-center w-full px-4">
            <button
              onClick={handleBegin}
              onMouseEnter={() => onPlaySound('select')}
              className="mc-button w-full max-w-md text-3xl md:text-5xl py-6 md:py-8 bg-emerald-600 border-emerald-400 hover:scale-105 transition-all duration-200 shadow-[0_6px_0_#064e3b] md:shadow-[0_10px_0_#064e3b]"
            >
              INITIALIZE ADVOCACY
            </button>
            <div className="flex flex-wrap gap-4 justify-center w-full">
              <button
                onClick={handleHowTo}
                onMouseEnter={() => onPlaySound('select')}
                className="mc-button w-full sm:w-56 text-xl md:text-2xl py-3 bg-[#5d5d5d] border-[#999] hover:bg-[#777] shadow-[0_4px_0_#333] md:shadow-[0_6px_0_#333]"
              >
                HOW TO PLAY
              </button>
              <button
                onClick={handleSettings}
                onMouseEnter={() => onPlaySound('select')}
                className="mc-button w-full sm:w-56 text-xl md:text-2xl py-3 bg-[#444] border-[#777] hover:bg-[#555] shadow-[0_4px_0_#222] md:shadow-[0_6px_0_#222]"
              >
                SETTINGS
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none opacity-20">
          <span className="absolute top-[10%] left-[10%] text-6xl animate-bounce">🥩</span>
          <span className="absolute top-[80%] left-[15%] text-6xl animate-pulse">💰</span>
          <span className="absolute top-[20%] right-[10%] text-6xl animate-bounce delay-100">⭐</span>
          <span className="absolute top-[70%] right-[20%] text-6xl animate-pulse delay-75">⚔️</span>
        </div>
      </div>
    );
  }
  if (step === 'role-selection') {
    return (
      <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
        <div className="mc-container max-w-5xl w-full p-0 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.15)] border-[8px] border-black">

          {/* Header */}
          <div className="bg-emerald-600 p-6 border-b-8 border-black text-center">
            <h2 className="text-4xl md:text-5xl font-black text-white text-pixel uppercase leading-none tracking-tight">SELECT YOUR PROTOCOL</h2>
            <p className="text-emerald-100 text-base mt-2 font-bold uppercase tracking-[0.3em]">Choose your citizen identity — constraints apply</p>
          </div>

          {/* Role Cards */}
          <div className="bg-[#1a1a1a] p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto fancy-scrollbar">
            {USER_ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role)}
                onMouseEnter={() => onPlaySound('select')}
                className="p-5 flex flex-col items-start text-left bg-[#2a2a2a] hover:bg-[#1e3a2a] border-4 border-white/10 hover:border-emerald-500 hover:scale-[1.02] transition-all group shadow-lg"
              >
                <h3 className="text-2xl font-black text-emerald-400 text-pixel uppercase mb-1 group-hover:translate-x-1 transition-transform">{role.name}</h3>
                <p className="text-white/70 text-sm font-bold mb-4 italic leading-snug">{role.description}</p>

                <div className="grid grid-cols-2 gap-2 w-full">
                  <div className="bg-black/40 border border-white/10 px-3 py-1.5 flex justify-between items-center">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Income</span>
                    <span className="text-yellow-400 text-xs font-black">{role.setup.income}</span>
                  </div>
                  <div className="bg-black/40 border border-white/10 px-3 py-1.5 flex justify-between items-center">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Sector</span>
                    <span className="text-emerald-400 text-xs font-black">{role.setup.location}</span>
                  </div>
                  <div className="bg-black/40 border border-white/10 px-3 py-1.5 flex justify-between items-center">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Budget</span>
                    <span className="text-amber-400 text-xs font-black">{role.initialCredits} CREDITS</span>
                  </div>
                  <div className="bg-black/40 border border-white/10 px-3 py-1.5 flex justify-between items-center">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Trust</span>
                    <span className="text-cyan-400 text-xs font-black">{role.initialTrust} TRUST</span>
                  </div>
                </div>

                <div className="mt-3 w-full flex justify-end">
                  <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest group-hover:text-emerald-400 transition-colors">[ ACCEPT PROTOCOL → ]</span>
                </div>
              </button>
            ))}
          </div>

          <div className="bg-black p-4 text-center border-t-4 border-white/10">
            <button onClick={() => setStep('title')} className="mc-button w-full text-lg bg-stone-700 border-stone-500 font-black uppercase tracking-widest text-white/80 hover:text-white">← BACK TO TITLE</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'theme-selection') {
    return (
      <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-md">
        <div className="mc-container max-w-5xl w-full p-0 overflow-hidden shadow-2xl border-[8px] border-black">
          <div className="bg-emerald-600 p-6 border-b-8 border-black">
            <h2 className="text-4xl md:text-6xl font-black text-center text-pixel text-white uppercase leading-none">CHOOSE YOUR WORLD</h2>
            <p className="text-center text-emerald-100 uppercase mt-2 tracking-widest font-bold">Select the environment for your odyssey</p>
          </div>
          <div className="bg-[#c6c6c6] p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => handleFinalStart(t.id)}
                onMouseEnter={() => onPlaySound('select')}
                className="flex flex-col border-4 border-black p-4 bg-[#7a7a7a] hover:bg-white hover:scale-105 transition-all group"
              >
                <div
                  className="w-full h-32 border-4 border-black mb-4 flex flex-col relative overflow-hidden"
                  style={{ backgroundColor: t.bg }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-125 transition-transform duration-500">{t.icon}</div>
                  <div className="mt-auto h-8 w-full border-t-2 border-black" style={{ backgroundColor: t.road }} />
                </div>
                <h3 className="text-xl font-black text-pixel uppercase text-white group-hover:text-black leading-none mb-1">{t.name}</h3>
                <p className="text-xs font-bold text-white/60 group-hover:text-black/60 leading-tight">{t.desc}</p>
              </button>
            ))}
          </div>
          <div className="bg-[#3a3a3a] p-4 border-t-8 border-black">
            <button onClick={() => setStep('title')} className="mc-button w-full text-xl bg-stone-600 border-stone-400 font-black uppercase tracking-widest">BACK</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'settings') {
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
        <div className="mc-container max-w-2xl w-full p-0 overflow-hidden shadow-2xl border-[8px] border-black">
          <div className="bg-indigo-600 p-4 md:p-6 border-b-8 border-black">
            <h2 className="text-4xl md:text-6xl font-black text-center text-pixel text-white uppercase leading-none">AUDIO SETTINGS</h2>
          </div>
          <div className="bg-[#c6c6c6] p-6 md:p-10 space-y-8 md:space-y-12">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-2xl md:text-3xl font-black text-stone-800 uppercase text-pixel">Music Volume</label>
                <span className="text-xl md:text-2xl font-bold text-indigo-700">{Math.round(musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0" max="1" step="0.01"
                value={musicVolume}
                onChange={(e) => onSetMusicVolume(parseFloat(e.target.value))}
                className="w-full h-8 bg-stone-400 rounded-none border-4 border-black appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-2xl md:text-3xl font-black text-stone-800 uppercase text-pixel">Ambient Volume</label>
                <span className="text-xl md:text-2xl font-bold text-amber-700">{Math.round(ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0" max="1" step="0.01"
                value={ambientVolume}
                onChange={(e) => onSetAmbientVolume(parseFloat(e.target.value))}
                className="w-full h-8 bg-stone-400 rounded-none border-4 border-black appearance-none cursor-pointer accent-amber-600"
              />
            </div>
          </div>
          <div className="bg-[#3a3a3a] p-4 md:p-6 border-t-8 border-black">
            <button
              onClick={handleBack}
              onMouseEnter={() => onPlaySound('select')}
              className="mc-button w-full text-3xl md:text-4xl py-4 md:py-6 bg-amber-600 hover:bg-amber-500 border-amber-300 font-black uppercase text-pixel shadow-[0_6px_0_#92400e]"
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'how-to') {
    return (
      <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-md">
        <div className="mc-container max-w-4xl w-full p-0 overflow-y-auto max-h-[90vh] shadow-[0_0_100px_rgba(255,255,255,0.05)] border-[8px] border-black fancy-scrollbar">
          <div className="bg-yellow-500 p-4 md:p-6 border-b-8 border-black sticky top-0 z-10">
            <h2 className="text-4xl md:text-6xl font-black text-center text-black text-pixel uppercase leading-none">ADVOCACY PROTOCOL</h2>
          </div>
          <div className="bg-[#c6c6c6] p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-xl md:text-2xl">
            <div className="space-y-8">
              <h3 className="font-black border-b-4 border-red-600 pb-2 uppercase tracking-widest text-red-700 text-2xl md:text-3xl">THE ECONOMY</h3>
              <ul className="space-y-6">
                <li className="flex gap-4 items-center">
                  <span className="bg-red-600 p-2 border-2 border-black w-12 h-12 flex items-center justify-center text-2xl shrink-0">🔋</span>
                  <div>
                    <strong className="text-red-900 uppercase block text-lg">ENERGY</strong>
                    <span className="text-stone-700 text-base md:text-lg">Drains as you navigate. Hits 0 = System Critical.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-center">
                  <span className="bg-yellow-400 p-2 border-2 border-black w-12 h-12 flex items-center justify-center text-2xl shrink-0">💰</span>
                  <div>
                    <strong className="text-yellow-800 uppercase block text-lg">CREDITS</strong>
                    <span className="text-stone-700 text-base md:text-lg">Acquire grants at terminals. Operational budget.</span>
                  </div>
                </li>
                <li className="flex gap-4 items-center">
                  <span className="bg-blue-500 p-2 border-2 border-black w-12 h-12 flex items-center justify-center text-2xl shrink-0">⭐</span>
                  <div>
                    <strong className="text-blue-900 uppercase block text-lg">TRUST</strong>
                    <span className="text-stone-700 text-base md:text-lg">Earned by assisting citizens. Unlocks senior agents.</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-8">
              <h3 className="font-black border-b-4 border-blue-600 pb-2 uppercase tracking-widest text-blue-700 text-2xl md:text-3xl">YOUR CONTROLS</h3>
              <ul className="space-y-6">
                <li className="bg-white/40 p-3 md:p-4 border-2 border-black/20 flex justify-between items-center">
                  <span className="font-bold text-stone-800 uppercase text-lg">Movement</span>
                  <kbd className="bg-white text-2xl md:text-3xl px-3 py-1 border-4 border-black text-pixel">W/A/S/D</kbd>
                </li>
                <li className="bg-white/40 p-3 md:p-4 border-2 border-black/20 flex justify-between items-center">
                  <span className="font-bold text-stone-800 uppercase text-lg">Agent Sync</span>
                  <kbd className="bg-white text-2xl md:text-3xl px-3 py-1 border-4 border-black text-pixel">P</kbd>
                </li>
                <li className="bg-white/40 p-3 md:p-4 border-2 border-black/20 flex justify-between items-center">
                  <span className="font-bold text-stone-800 uppercase text-lg">Pause / Back</span>
                  <kbd className="bg-white text-2xl md:text-3xl px-3 py-1 border-4 border-black text-pixel">ESC</kbd>
                </li>
                <li className="bg-white/40 p-3 md:p-4 border-2 border-black/20 flex justify-between items-center">
                  <span className="font-bold text-stone-800 uppercase text-lg">Hangar Menu</span>
                  <kbd className="bg-white text-2xl md:text-3xl px-3 py-1 border-4 border-black text-pixel">V</kbd>
                </li>
                <li className="bg-white/40 p-3 md:p-4 border-2 border-black/20 flex justify-between items-center">
                  <span className="font-bold text-stone-800 uppercase text-lg">Exit/Enter Vehicle</span>
                  <kbd className="bg-white text-2xl md:text-3xl px-3 py-1 border-4 border-black text-pixel">C</kbd>
                </li>
              </ul>
            </div>
          </div>
          <div className="bg-[#3a3a3a] p-4 md:p-6 border-t-8 border-black sticky bottom-0 z-10">
            <button
              onClick={handleBack}
              onMouseEnter={() => onPlaySound('select')}
              className="mc-button w-full text-3xl md:text-4xl py-4 md:py-6 bg-amber-600 hover:bg-amber-500 border-amber-300 font-black uppercase text-pixel shadow-[0_6px_0_#92400e]"
            >
              BACK TO TITLE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Story / intro screen
  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black p-6 md:p-12 overflow-hidden">
      {/* Glowing radial background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0d3320_0%,_#000_70%)] opacity-90" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pixel-weave.png')] opacity-10" />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)] pointer-events-none" />

      {/* Skip button */}
      {lineIndex < storyLines.length - 1 && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 mc-button bg-black/60 border-emerald-800 text-emerald-600 text-sm md:text-lg py-2 px-6 hover:border-emerald-500 hover:text-emerald-400 transition-all uppercase font-black tracking-widest"
        >
          SKIP [ESC]
        </button>
      )}

      {/* Terminal title */}
      <div className="relative z-10 mb-6 md:mb-10 text-center">
        <span className="text-[10px] md:text-xs font-black text-emerald-700 uppercase tracking-[0.4em] block mb-1">// BENEFIT_QUEST v0.7E2 — LOADING BRIEFING...</span>
        <h1 className="text-2xl md:text-4xl font-black text-emerald-500 text-pixel uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">FIELD OPERATIONS DOSSIER</h1>
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent mt-3 animate-pulse" />
      </div>

      {/* Story lines */}
      <div className="max-w-4xl w-full space-y-3 md:space-y-5 relative z-10 flex flex-col overflow-y-auto max-h-[55vh] pb-4 fancy-scrollbar">
        {storyLines.slice(0, lineIndex + 1).map((line, i) => (
          <div
            key={i}
            className="flex items-start gap-4 bg-black/40 border border-emerald-900/60 px-4 md:px-6 py-3 md:py-4 animate-in fade-in slide-in-from-left-8 duration-500"
          >
            <span className="text-emerald-600 font-black text-xl md:text-2xl font-mono shrink-0 mt-0.5 select-none">&gt;&gt;</span>
            <p className="text-white font-bold text-lg md:text-2xl lg:text-3xl leading-snug">
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* Continue button */}
      {lineIndex === storyLines.length - 1 && (
        <div className="relative z-10 mt-8 md:mt-12 flex flex-col items-center gap-3 animate-in fade-in zoom-in duration-1000">
          <span className="text-emerald-700 text-xs font-black uppercase tracking-[0.4em] animate-pulse">— BRIEFING COMPLETE —</span>
          <button
            onClick={handleStoryFinished}
            onMouseEnter={() => onPlaySound('select')}
            className="mc-button text-3xl md:text-5xl px-10 md:px-20 py-5 md:py-8 bg-emerald-600 border-emerald-400 hover:bg-emerald-500 shadow-[0_6px_0_#064e3b] md:shadow-[0_10px_0_#064e3b] uppercase font-black text-white tracking-widest drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all"
          >
            ACCEPT PROTOCOL →
          </button>
          <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Your choices determine the outcome.</span>
        </div>
      )}
    </div>
  );
};

export default TitleScreen;