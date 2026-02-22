
import React from 'react';
import { ResourceState, VictoryType } from '../types';

interface EndScreenProps {
  status: 'gameover' | 'victory';
  victoryType: VictoryType | null;
  resources: ResourceState;
  onRestart: () => void;
  onPlaySound: (type: any) => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ status, victoryType, resources, onRestart, onPlaySound }) => {
  const isVictory = status === 'victory';

  const getEndingDetails = () => {
    if (!isVictory) {
      return {
        title: "SYSTEM CRITICAL",
        subtitle: "OUT OF ENERGY",
        description: "The complexity of the policy landscape overwhelems your Navigator Unit. Vital benefits remain locked, and the citizens lose hope. Advocacy protocols terminated.",
        color: "#ff5555",
        icon: "💀"
      };
    }

    switch (victoryType) {
      case 'hero':
        return {
          title: "PEOPLE'S ADVOCATE",
          subtitle: "LEGENDARY TRUST",
          description: "You arrived with modest credits, but the gratitude of the citizens echoes through the network. They tell stories of the Navigator who prioritized impact over profit. You have humanized the machine.",
          color: "#55ff55",
          icon: "⭐"
        };
      case 'merchant_prince':
        return {
          title: "SYSTEM ARCHITECT",
          subtitle: "WEALTHY & WISE",
          description: "Your units are heavy with credits and data packets. You navigated the network perfectly, trading at the right terminals and maintaining policy honor. The Benefit Haven welcomes its most successful navigator.",
          color: "#ffff55",
          icon: "👑"
        };
      case 'iron_monger':
        return {
          title: "THE AUDIT CHIEF",
          subtitle: "IMPACT AT ANY COST",
          description: "You arrived with mountains of credits, but the network is colder now. You outsmarted every auditor and agent, though you left few friends behind. Efficiency is absolute, even if it is lonely.",
          color: "#aaaaaa",
          icon: "⚔️"
        };
      case 'survivor':
      default:
        return {
          title: "HUMBLE NAVIGATOR",
          subtitle: "MISSION ENDED",
          description: "The gates of the Benefit Haven open. You are weary, low on energy, and your pockets aren't full, but you made it. In a world of fragments, bridging the gap for one citizen is a victory in itself.",
          color: "#ffffff",
          icon: "🏠"
        };
    }
  };

  const details = getEndingDetails();

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6 z-[100] animate-in fade-in duration-1000">
      <div className="mc-container max-w-3xl w-full p-1 border-4 border-black overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
        {/* Header Banner */}
        <div
          className="p-10 text-center border-b-4 border-black relative overflow-hidden"
          style={{ backgroundColor: details.color + '22' }}
        >
          <div className="absolute top-2 right-4 text-6xl opacity-20 pointer-events-none">{details.icon}</div>
          <h1 className="text-6xl md:text-[5rem] font-black text-pixel uppercase leading-none mb-2" style={{ color: details.color }}>
            {details.title}
          </h1>
          <p className="text-2xl font-bold text-white/60 tracking-[0.4em] uppercase">{details.subtitle}</p>
        </div>

        {/* Narrative Body */}
        <div className="p-8 bg-[#c6c6c6] space-y-8">
          <div className="bg-[#8b8b8b] p-6 border-4 border-black shadow-inner">
            <p className="text-2xl text-stone-900 font-bold leading-relaxed text-center italic">
              "{details.description}"
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#484848] border-4 border-black p-4 flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Trust</span>
              <span className="text-3xl text-blue-400 font-bold text-pixel">{resources.reputation}</span>
            </div>
            <div className="bg-[#484848] border-4 border-black p-4 flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Budget</span>
              <span className="text-3xl text-yellow-400 font-bold text-pixel">{resources.gold}C</span>
            </div>
            <div className="bg-[#484848] border-4 border-black p-4 flex flex-col items-center">
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Outreach</span>
              <span className="text-3xl text-emerald-400 font-bold text-pixel">{resources.journeyCount}</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => { onPlaySound('confirm'); onRestart(); }}
              onMouseEnter={() => onPlaySound('select')}
              className="mc-button w-full text-3xl py-6 bg-emerald-700 hover:bg-emerald-600 active:translate-y-1"
            >
              RESPAWN AT START
            </button>
          </div>
        </div>

        {/* Decorative footer */}
        <div className="bg-[#313131] p-3 text-center border-t-4 border-black">
          <span className="text-white/20 text-xs font-bold uppercase tracking-widest">Seed: {Math.floor(Math.random() * 9999999)} | Infinite Edition</span>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
