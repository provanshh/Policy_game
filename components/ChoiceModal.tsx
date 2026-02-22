
import React from 'react';
import { Encounter, Choice, Passenger } from '../types';

interface ChoiceModalProps {
  encounter: Encounter;
  onChoice: (choice: Choice) => void;
  result: string | null;
  onClose: () => void;
  flags: Set<string>;
  reputation: number;
  passengers: Passenger[];
  onBuyTokens: () => void;
  onPlaySound: (type: any) => void;
  playerTokens: number;
}

const ChoiceModal: React.FC<ChoiceModalProps> = ({
  encounter, onChoice, result, onClose, flags, reputation, passengers, onBuyTokens, onPlaySound, playerTokens
}) => {
  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="mc-container max-w-2xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border-[6px] border-black">
        {/* Header */}
        <div className="bg-[#3a3a3a] p-6 border-b-4 border-black flex items-center gap-6">
          <div className="w-24 h-24 bg-emerald-600 border-4 border-black flex items-center justify-center text-6xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {encounter.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-black text-white uppercase text-pixel leading-none mb-2">{encounter.title}</h2>
            <div className="flex gap-2">
              <span className="bg-emerald-600 text-white text-[10px] px-2 py-1 font-bold uppercase border border-black animate-pulse">Benefit Protocol Alpha</span>
              <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 font-bold uppercase border border-black tracking-widest">Bureaucracy Challenge</span>
            </div>
          </div>
        </div>

        {/* Multi-Agent Coordination View */}
        {!result && passengers.length > 0 && (
          <div className="bg-black/90 p-3 border-b-4 border-black flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-emerald-400 font-pixel text-[10px] uppercase">Agent Coordination Feed:</span>
              <div className="h-0.5 bg-emerald-900 flex-1 opacity-50" />
            </div>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {passengers.map(p => (
                <div key={p.id} className="flex-shrink-0 flex items-center gap-2 bg-emerald-950/40 px-2 py-1 border border-emerald-500/20 text-[10px]">
                  <span className="text-yellow-400 font-bold">{p.type.replace('merchant', '📊').replace('cook', '🧠').replace('scholar', '📊').replace('guard', '⚠')}</span>
                  <span className="text-emerald-300 uppercase tracking-tighter italic">
                    {p.type === 'merchant' && "Optimizer: High credit yield detected."}
                    {p.type === 'cook' && "Policy Agent: Eligibility rules identified."}
                    {p.type === 'scholar' && "Eligibility Agent: Validating parameters..."}
                    {p.type === 'guard' && "Risk Agent: Predicting rejection risk..."}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-8 space-y-8 bg-[#c6c6c6]">
          {!result ? (
            <>
              <div className="bg-[#999] p-6 border-4 border-black text-stone-950 text-2xl leading-relaxed italic shadow-[inset_4px_4px_0px_rgba(255,255,255,0.2)]">
                "{encounter.description}"
              </div>

              <div className="flex flex-col gap-4">
                {encounter.choices.map((choice, index) => {
                  const hasRequiredFlag =
                    (!choice.requiredFlag) ||
                    (flags.has(choice.requiredFlag)) ||
                    (choice.requiredFlag === 'reputation_15' && reputation >= 15) ||
                    (choice.requiredFlag === 'reputation_10' && reputation >= 10) ||
                    (choice.requiredFlag === 'reputation_5' && reputation >= 5) ||
                    (choice.requiredFlag === 'reputation_3' && reputation >= 3);

                  const hasRequiredPassenger =
                    (!choice.requiredPassengerType) ||
                    (passengers.some(p => p.type === choice.requiredPassengerType));

                  const isAvailable = hasRequiredFlag && hasRequiredPassenger;
                  const btnColor = choice.color || 'bg-[#7a7a7a]';

                  return (
                    <button
                      key={choice.id}
                      disabled={!isAvailable}
                      onMouseEnter={() => isAvailable && onPlaySound('select')}
                      onClick={() => onChoice(choice)}
                      className={`mc-button w-full text-left p-5 group flex flex-col gap-2 relative border-4 border-black ${btnColor} hover:brightness-110 active:translate-y-1 active:shadow-none shadow-[0_4px_0_#000] disabled:grayscale disabled:opacity-50`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="bg-black/40 px-2 py-1 text-white border border-black/40 text-sm font-bold">[{index + 1}]</span>
                          <span className="text-2xl font-black uppercase text-white text-pixel group-hover:translate-x-1 transition-transform">{choice.text}</span>
                        </div>
                        {!isAvailable && (
                          <div className="bg-red-700 px-3 py-1 text-white border-2 border-black font-bold text-sm">
                            {!hasRequiredPassenger ? `NEED ${choice.requiredPassengerType?.toUpperCase()}` : 'LOCKED'}
                          </div>
                        )}
                        {choice.advisoryTokenCost && playerTokens < choice.advisoryTokenCost && (
                          <div
                            onClick={(e) => { e.stopPropagation(); onBuyTokens(); }}
                            className="bg-indigo-600 px-3 py-1 text-white border-2 border-black font-bold text-[10px] hover:bg-indigo-500 animate-pulse pointer-events-auto"
                          >
                            BUY TOKENS
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 ml-10">
                        {choice.foodCost && <span className="text-sm font-bold bg-red-950/40 px-2 py-0.5 text-white border border-black/20">-{choice.foodCost} ENERGY</span>}
                        {choice.goldCost && <span className="text-sm font-bold bg-yellow-950/40 px-2 py-0.5 text-white border border-black/20">-{choice.goldCost} CREDITS</span>}
                        {choice.foodGain && <span className="text-sm font-bold bg-green-500/60 px-2 py-0.5 text-white border border-black/20">+{choice.foodGain} ENERGY</span>}
                        {choice.goldGain && <span className="text-sm font-bold bg-yellow-400/60 px-2 py-0.5 text-black border border-black/20">+{choice.goldGain} CREDITS</span>}
                        {choice.reputationGain && <span className="text-sm font-bold bg-blue-500/60 px-2 py-0.5 text-white border border-black/20">+{choice.reputationGain} TRUST</span>}
                        {choice.reputationCost && <span className="text-sm font-bold bg-purple-900/60 px-2 py-0.5 text-white border border-black/20">-{choice.reputationCost} TRUST</span>}
                        {choice.advisoryTokenCost && <span className="text-sm font-bold bg-indigo-500/60 px-2 py-0.5 text-white border border-black/20">-{choice.advisoryTokenCost} TOKENS</span>}

                        {choice.probability !== undefined && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase text-stone-600">Approval Likelihood:</span>
                            <span className={`text-sm font-black ${choice.probability > 70 ? 'text-emerald-700' : 'text-amber-700'}`}>{choice.probability}%</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center space-y-8 py-4 animate-in slide-in-from-bottom-6">
              <div className="bg-white p-8 border-[6px] border-black text-3xl font-black text-stone-900 uppercase leading-relaxed shadow-2xl relative">
                <div className="absolute -top-6 -left-6 bg-yellow-400 border-4 border-black p-2 animate-bounce">
                  ✨
                </div>
                {result}
              </div>
              <button
                onClick={onClose}
                onMouseEnter={() => onPlaySound('select')}
                className="mc-button w-full text-4xl py-6 bg-emerald-600 hover:bg-emerald-500 shadow-[0_6px_0_#064e3b] active:shadow-none active:translate-y-1 font-black text-pixel uppercase"
              >
                PROCEED [SPACE/ENTER]
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChoiceModal;
