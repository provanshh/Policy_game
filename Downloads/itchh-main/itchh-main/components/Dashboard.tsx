
import React from 'react';
import { ResourceState, PlayerProfile } from '../types';

interface DashboardProps {
    resources: ResourceState;
    onStartLevel: () => void;
    onViewDocs: () => void;
    onViewLeaderboard: () => void;
    onBuyTokens: () => void;
    onPlaySound: (type: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ resources, onStartLevel, onViewDocs, onViewLeaderboard, onBuyTokens, onPlaySound }) => {
    const profile = resources.playerProfile;

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-[#111] p-4 overflow-hidden">
            {/* HUD Bar */}
            <div className="absolute top-0 left-0 right-0 bg-black/80 border-b-4 border-emerald-600 p-4 flex justify-between items-center z-20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 border-2 border-white/20 flex items-center justify-center text-2xl shadow-lg">👤</div>
                    <div>
                        <h2 className="text-white font-black text-2xl text-pixel uppercase leading-none">{profile?.name}</h2>
                        <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest">{profile?.state} | Protocol: {resources.selectedRole?.name || 'N/A'}</span>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="text-center">
                        <span className="block text-[10px] text-white/40 uppercase font-black tracking-widest">Literacy</span>
                        <span className="text-yellow-400 text-xl font-pixel">{profile?.literacyScore}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] text-white/40 uppercase font-black tracking-widest">Optimization</span>
                        <span className="text-emerald-400 text-xl font-pixel">{profile?.optimizationScore}%</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-[10px] text-white/40 uppercase font-black tracking-widest">Advisory Tokens</span>
                        <span className="text-indigo-400 text-xl font-pixel">{profile?.advisoryTokens} 🪙</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 w-full max-w-7xl relative z-10 mt-16">
                {/* Main Mission Card */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="mc-container p-0 border-[6px] border-black overflow-hidden shadow-2xl bg-[#c6c6c6]">
                        <div className="bg-emerald-600 p-6 border-b-6 border-black flex justify-between items-center">
                            <div>
                                <h3 className="text-4xl font-black text-white text-pixel uppercase">ACTIVE SECTOR: PUNJAB</h3>
                                <p className="text-emerald-100 font-bold uppercase tracking-widest text-sm">Objective: Maximize Benefit DNA within 12 Months</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-emerald-950 font-black text-xl uppercase italic">Level 01</span>
                                <span className="text-white font-bold">Scheme Discovery Phase</span>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-stone-900 uppercase border-b-2 border-black/10 pb-2">Mission Parameters</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between font-bold text-stone-700 uppercase text-sm">
                                        <span>Time Limit</span>
                                        <span className="text-black">12 Months</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-stone-700 uppercase text-sm">
                                        <span>Target Score</span>
                                        <span className="text-black">1,500 BP</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-stone-700 uppercase text-sm">
                                        <span>Difficulty</span>
                                        <span className="text-emerald-700 italic">Operational</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-6 bg-black/5 border-4 border-dashed border-black/20 rounded-xl italic text-stone-500 text-center font-bold">
                                "Your crops in Sector 7 have faced unexpected stressors. Initialize protocol to find financial support."
                            </div>
                        </div>

                        <div className="p-6 bg-[#b3b3b3] border-t-6 border-black">
                            <button
                                onClick={onStartLevel}
                                onMouseEnter={() => onPlaySound('select')}
                                className="mc-button w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-4xl font-black text-white border-4 border-black"
                            >
                                START MISSION
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={onViewDocs}
                            onMouseEnter={() => onPlaySound('select')}
                            className="mc-button p-6 bg-[#333] border-stone-600 text-left group"
                        >
                            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📂</div>
                            <h5 className="text-xl font-black text-white uppercase text-pixel">DOCUMENT INVENTORY</h5>
                            <p className="text-white/40 text-xs font-bold uppercase mt-1">Manage {resources.documents.length} protocol certificates</p>
                        </button>
                        <button
                            onClick={onViewLeaderboard}
                            onMouseEnter={() => onPlaySound('select')}
                            className="mc-button p-6 bg-[#333] border-indigo-900 text-left group"
                        >
                            <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
                            <h5 className="text-xl font-black text-white uppercase text-pixel">LEADERBOARD</h5>
                            <p className="text-white/40 text-xs font-bold uppercase mt-1">View global benefit optimizers</p>
                        </button>
                    </div>
                </div>

                {/* Sidebar Status */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="mc-container p-6 bg-[#3a3a3a] border-[6px] border-black text-white space-y-6">
                        <h4 className="text-2xl font-black text-pixel border-b-4 border-emerald-600 pb-2 uppercase italic text-emerald-400">AGENT STATUS</h4>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-black/40 flex items-center justify-center text-lg border border-white/20">🧠</div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-white/50">
                                        <span>Policy Agent</span>
                                        <span className="text-emerald-400">Online</span>
                                    </div>
                                    <div className="h-1 bg-white/10 mt-1"><div className="h-full bg-emerald-500 w-full" /></div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="w-8 h-8 bg-black/40 flex items-center justify-center text-lg border border-white/20">⚖️</div>
                                <div className="flex-1">
                                    <div className="flex justify-between text-[10px] font-black uppercase text-white/50">
                                        <span>Appeal Agent</span>
                                        <span className="text-red-500">Standby</span>
                                    </div>
                                    <div className="h-1 bg-white/10 mt-1"><div className="h-full bg-red-500 w-0" /></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t-2 border-white/10">
                            <h5 className="text-xs font-black uppercase text-white/40 mb-2">Benefit Point DNA Score</h5>
                            <div className="flex items-end gap-1">
                                <span className="text-5xl font-pixel text-yellow-500 leading-none">{resources.score}</span>
                                <span className="text-xs font-bold text-white/20 mb-1 uppercase tracking-widest">Points</span>
                            </div>
                        </div>
                    </div>

                    {/* Zynd Wallet Card */}
                    <div className="mc-container p-6 bg-indigo-950 border-[6px] border-black shadow-[0_10px_0_#1e1b4b]">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg font-black text-white uppercase tracking-widest text-pixel">ZYND WALLET</h4>
                            <span className="text-2xl font-pixel text-indigo-300">{profile?.advisoryTokens ?? 0} 🪙</span>
                        </div>

                        {/* Transaction History */}
                        <div className="space-y-2 mb-4 max-h-28 overflow-y-auto">
                            {profile?.transactions && profile.transactions.length > 0 ? (
                                profile.transactions.slice(0, 4).map(tx => (
                                    <div key={tx.id} className="bg-black/30 border border-white/10 p-2 flex justify-between items-center text-[9px]">
                                        <span className="font-mono text-white/40 truncate max-w-[90px]">{tx.id}</span>
                                        <span className="text-emerald-400 font-black uppercase">✓ SUCCESS</span>
                                        <span className="text-white font-bold">+{tx.tokensPaid}🪙</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[9px] text-white/20 italic uppercase text-center py-2">No transactions yet...</p>
                            )}
                        </div>

                        <button
                            onClick={onBuyTokens}
                            onMouseEnter={() => onPlaySound('select')}
                            className="mc-button w-full bg-indigo-600 border-indigo-400 text-sm py-3 font-black uppercase"
                        >
                            💳 BUY ADVISORY TOKENS
                        </button>
                        <p className="text-indigo-400/50 text-[8px] text-center mt-2 uppercase tracking-widest">Powered by Zynd Pay · Secure Gateway</p>
                    </div>
                </div>
            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_#10b981_0%,_transparent_50%)]" />
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,_#3b82f6_0%,_transparent_50%)]" />
            </div>
        </div>
    );
};

export default Dashboard;
