import React, { useState, useEffect, useRef } from 'react';
import { ResourceState } from '../types';

interface UIOverlayProps {
  resources: ResourceState;
  flags: Set<string>;
  musicVolume: number;
  ambientVolume: number;
  isMouseControlEnabled: boolean;
  onSetMusicVolume: (v: number) => void;
  onSetAmbientVolume: (v: number) => void;
  onSetMouseControl: (enabled: boolean) => void;
  onPlaySound: (type: any) => void;
  notifications: { id: number, message: string }[];
  showSettings: boolean;
  onToggleSettings: () => void;
}

const UIOverlay: React.FC<UIOverlayProps> = ({
  resources,
  flags,
  musicVolume, ambientVolume, isMouseControlEnabled,
  onSetMusicVolume, onSetAmbientVolume, onSetMouseControl,
  onPlaySound,
  notifications,
  showSettings,
  onToggleSettings
}) => {
  const foodWidth = Math.min(100, (resources.food / 100) * 100);

  // Animation states
  const [goldAnim, setGoldAnim] = useState<'gain' | 'loss' | null>(null);
  const [repAnim, setRepAnim] = useState<'gain' | 'loss' | null>(null);
  const [foodAnim, setFoodAnim] = useState<'gain' | 'loss' | null>(null);
  const [lifeAnim, setLifeAnim] = useState(false);

  // Previous values to detect changes
  const prevGold = useRef(resources.gold);
  const prevRep = useRef(resources.reputation);
  const prevFood = useRef(resources.food);
  const prevLives = useRef(resources.lives);

  useEffect(() => {
    if (resources.gold > prevGold.current) setGoldAnim('gain');
    else if (resources.gold < prevGold.current) setGoldAnim('loss');
    prevGold.current = resources.gold;
    const timer = setTimeout(() => setGoldAnim(null), 500);
    return () => clearTimeout(timer);
  }, [resources.gold]);

  useEffect(() => {
    if (resources.reputation > prevRep.current) setRepAnim('gain');
    else if (resources.reputation < prevRep.current) setRepAnim('loss');
    prevRep.current = resources.reputation;
    const timer = setTimeout(() => setRepAnim(null), 500);
    return () => clearTimeout(timer);
  }, [resources.reputation]);

  useEffect(() => {
    const delta = resources.food - prevFood.current;
    if (Math.abs(delta) > 1) {
      if (delta > 0) setFoodAnim('gain');
      else setFoodAnim('loss');
    }
    prevFood.current = resources.food;
    const timer = setTimeout(() => setFoodAnim(null), 500);
    return () => clearTimeout(timer);
  }, [resources.food]);

  useEffect(() => {
    if (resources.lives < prevLives.current) {
      setLifeAnim(true);
      setTimeout(() => setLifeAnim(false), 800);
    }
    prevLives.current = resources.lives;
  }, [resources.lives]);

  const maxPassengers = flags.has('capacity_upgrade') ? 5 : 3;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 p-8 flex flex-col justify-between">
      {/* Notifications Layer */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50">
        {notifications.map(n => (
          <div key={n.id} className="mc-container px-6 py-2 bg-emerald-600 border-emerald-400 border-2 shadow-[0_4px_0_#064e3b] animate-float-toast">
            <span className="text-white text-xl md:text-2xl font-black text-pixel uppercase drop-shadow-[2px_2px_0px_#000]">
              {n.message}
            </span>
          </div>
        ))}
      </div>

      {/* Top Right: Settings Button */}
      <div className="absolute right-8 top-8 pointer-events-auto">
        <button
          onClick={onToggleSettings}
          onMouseEnter={() => onPlaySound('select')}
          className="mc-button w-14 h-14 text-2xl flex items-center justify-center bg-[#444] border-black hover:rotate-90 transition-transform duration-300"
        >
          ⚙️
        </button>
      </div>

      {/* Settings Modal (Overlay everything) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] pointer-events-auto animate-in fade-in duration-300 backdrop-blur-md">
          <div className="mc-container max-w-lg w-full p-0 overflow-hidden border-[8px] border-black shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            <div className="bg-indigo-600 p-6 border-b-8 border-black flex justify-between items-center">
              <h2 className="text-4xl md:text-5xl font-black text-white text-pixel uppercase leading-none">GAME SETTINGS</h2>
              <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest bg-black/30 px-2 py-1">Shortcut: [S]</span>
            </div>
            <div className="bg-[#c6c6c6] p-8 space-y-8">
              {/* Audio Config */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xl uppercase font-black text-stone-900 text-pixel">
                    <span>Music Volume</span>
                    <span className="text-indigo-700">{Math.round(musicVolume * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={musicVolume}
                    onChange={(e) => onSetMusicVolume(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 bg-stone-400 h-6 border-4 border-black appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xl uppercase font-black text-stone-900 text-pixel">
                    <span>Ambient Volume</span>
                    <span className="text-amber-700">{Math.round(ambientVolume * 100)}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={ambientVolume}
                    onChange={(e) => onSetAmbientVolume(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 bg-stone-400 h-6 border-4 border-black appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Control Mode Config */}
              <div className="pt-4 border-t-4 border-black/10">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-stone-900 text-pixel uppercase">MOUSE MODE</span>
                    <span className="text-sm font-bold text-stone-600 uppercase italic">Follow X-Pointer</span>
                  </div>
                  <button
                    onClick={() => {
                      onPlaySound('select');
                      onSetMouseControl(!isMouseControlEnabled);
                    }}
                    className={`mc-button w-32 py-2 text-xl font-black uppercase border-2 border-black ${isMouseControlEnabled ? 'bg-emerald-600' : 'bg-red-800'}`}
                  >
                    {isMouseControlEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#3a3a3a] p-4">
              <button
                onClick={onToggleSettings}
                onMouseEnter={() => onPlaySound('select')}
                className="mc-button w-full text-2xl py-3 bg-amber-600 hover:bg-amber-500 border-2 border-black font-black uppercase tracking-widest text-pixel shadow-[0_4px_0_#92400e]"
              >
                BACK TO ROAD [S]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Agents List (Only visible when settings is closed) */}
      {!showSettings && (
        <div className="absolute right-8 top-24 w-64 flex flex-col gap-2 mt-16">
          <h3 className="text-white text-xl font-bold uppercase tracking-widest bg-black/40 p-2 border-b-2 border-yellow-500 text-pixel">Active Agent Cluster ({resources.passengers.length}/{maxPassengers})</h3>
          {resources.passengers.length === 0 && (
            <p className="text-white/40 text-sm italic p-2 bg-black/20">Navigating the policy wild alone...</p>
          )}
          {resources.passengers.map(p => (
            <div key={p.id} className="bg-black/60 border-2 border-white/10 p-3 flex flex-col animate-in slide-in-from-right-10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-yellow-400 font-bold uppercase text-lg text-pixel">{p.name}</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 text-white uppercase">{p.type.replace('merchant', 'Matcher').replace('cook', 'Interpreter').replace('scholar', 'Verifier').replace('guard', 'Advocate')}</span>
              </div>
              <span className="text-emerald-400 text-sm font-bold tracking-tight">{p.bonusText}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom HUD: 3-column layout */}
      <div className="flex justify-between items-end">

        {/* LEFT COLUMN: Profile → Time/Token HUD → Month Bar → Lives */}
        <div className="flex flex-col gap-2">
          {resources.selectedRole && (
            <div className="bg-black/60 border-l-4 border-emerald-500 p-4 animate-in slide-in-from-left-10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-emerald-600 flex items-center justify-center text-xl border-2 border-black">👤</div>
                <div>
                  <h4 className="text-emerald-400 font-pixel text-xl uppercase leading-none">{resources.selectedRole.name}</h4>
                  <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Active Protocol</span>
                </div>
              </div>
              <p className="text-white/60 text-xs italic font-bold max-w-[200px] leading-tight mt-1">{resources.selectedRole.description}</p>
              <div className="mt-2 flex gap-2 flex-wrap">
                {resources.selectedRole.setup.docs.map(doc => (
                  <span key={doc} className="text-[9px] bg-indigo-900/50 text-indigo-200 px-2 py-0.5 border border-indigo-500/30 uppercase font-bold">📄 {doc}</span>
                ))}
              </div>
            </div>
          )}

          {/* Time Elapsed + Advisory Token */}
          <div className="bg-black/80 border-2 border-white/20 px-4 py-2 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-yellow-500 text-[10px] font-pixel uppercase">Time Elapsed</span>
              <span className="text-white text-2xl font-pixel uppercase tracking-tighter">Month {Math.floor(resources.monthsElapsed) + 1} / 12</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex flex-col">
              <span className="text-indigo-400 text-[10px] font-pixel uppercase">Advisory Tokens</span>
              <span className="text-indigo-300 text-2xl font-pixel">{resources.playerProfile?.advisoryTokens ?? 0} 🪙</span>
            </div>
          </div>

          {/* Month Progress Bar */}
          <div className="w-full h-3 bg-white/10 border border-white/20">
            <div
              className="h-full bg-yellow-500 transition-all duration-1000"
              style={{ width: `${(resources.monthsElapsed / 12) * 100}%` }}
            />
          </div>

          {/* Lives — directly below time box */}
          <div className={`flex gap-2 bg-black/40 p-2 border-2 border-white/10 w-fit ${lifeAnim ? 'animate-bounce' : ''}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={`text-3xl transition-opacity duration-300 ${i < resources.lives ? 'opacity-100 scale-110' : 'opacity-20 grayscale'}`}>
                ❤️
              </div>
            ))}
          </div>
        </div>

        {/* CENTER COLUMN: Energy + Credits — shifted upward */}
        <div className="flex flex-col gap-3 mb-16">
          <div className="flex items-center gap-3">
            <span className={`bg-black/60 text-white px-3 py-1 text-2xl border-2 border-white/20 transition-colors ${foodAnim === 'gain' ? 'text-green-400' : foodAnim === 'loss' ? 'text-red-400' : ''}`}>
              ENERGY
            </span>
            <div className={`w-64 h-10 bg-black border-4 border-[#313131] relative shadow-2xl ${foodAnim ? 'animate-pop' : ''}`}>
              <div
                className="h-full bg-red-600 transition-all duration-300"
                style={{ width: `${foodWidth}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold text-pixel tracking-wider shadow-inner">
                {Math.ceil(resources.food)} / 100
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-14 h-14 bg-yellow-600 border-4 border-black flex items-center justify-center text-3xl shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.5)] ${goldAnim ? 'animate-pop' : ''}`}>
              💰
            </div>
            <span className={`text-4xl text-yellow-400 text-pixel font-bold transition-all drop-shadow-md ${goldAnim === 'gain' ? 'animate-flash-gain' : goldAnim === 'loss' ? 'animate-flash-loss' : ''}`}>
              {resources.gold} CREDITS
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: Trust */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <span className={`text-4xl text-cyan-400 text-pixel font-bold transition-all drop-shadow-md ${repAnim === 'gain' ? 'animate-flash-gain' : repAnim === 'loss' ? 'animate-flash-loss' : ''}`}>
              TRUST: {resources.reputation}
            </span>
            <div className={`w-14 h-14 bg-cyan-800 border-4 border-black flex items-center justify-center text-3xl shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.5)] ${repAnim ? 'animate-pop' : ''}`}>
              ⭐
            </div>
          </div>
          <div className="w-56 h-3 bg-black border-2 border-[#313131] shadow-xl">
            <div
              className="h-full bg-cyan-400 transition-all duration-700"
              style={{ width: `${Math.min(100, (resources.reputation) * 2)}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default UIOverlay;