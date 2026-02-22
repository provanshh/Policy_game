
import React, { useState } from 'react';
import { PaymentPack, Transaction } from '../types';
import { ADVISORY_PACKS, ZyndPayService } from '../services/zyndPay';
import { ZyndSearchService, ZyndSearchResponse } from '../services/zyndSearch';

interface ZyndPayModalProps {
    playerEmail: string;
    playerState?: string;
    playerRole?: string;
    onSuccess: (tokens: number, tx: Transaction) => void;
    onClose: () => void;
    onPlaySound: (type: any) => void;
}

type Tab = 'pay' | 'search';

const ZyndPayModal: React.FC<ZyndPayModalProps> = ({
    playerEmail, playerState = 'Punjab', playerRole = 'Farmer',
    onSuccess, onClose, onPlaySound
}) => {
    // Payment state
    const [payStep, setPayStep] = useState<'browse' | 'processing' | 'success'>('browse');
    const [selectedPack, setSelectedPack] = useState<PaymentPack | null>(null);
    const [tx, setTx] = useState<Transaction | null>(null);

    // Search state
    const [activeTab, setActiveTab] = useState<Tab>('pay');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<ZyndSearchResponse | null>(null);

    // ─── Payment Handler ───────────────────────────────────────
    const handlePurchase = async (pack: PaymentPack) => {
        setSelectedPack(pack);
        setPayStep('processing');
        onPlaySound('select');
        try {
            const newTx = await ZyndPayService.createTransaction(playerEmail, pack);
            setTx(newTx);
            const isVerified = await ZyndPayService.verifyPayment(newTx.id, playerEmail, pack.tokens);
            if (isVerified) {
                onPlaySound('confirm');
                setPayStep('success');
                setTimeout(() => {
                    onSuccess(pack.tokens, { ...newTx, status: 'success' });
                    onClose();
                }, 2200);
            } else {
                alert('Payment verification failed. Please retry.');
                setPayStep('browse');
            }
        } catch {
            setPayStep('browse');
        }
    };

    // ─── Search Handler ────────────────────────────────────────
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setSearchLoading(true);
        setSearchResults(null);
        onPlaySound('select');
        try {
            const results = await ZyndSearchService.search(
                searchQuery, playerState, playerRole, 'Low'
            );
            setSearchResults(results);
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
            <div className="mc-container max-w-2xl w-full border-[8px] border-black overflow-hidden bg-[#111] shadow-[0_0_100px_rgba(79,70,229,0.4)]">

                {/* ── Header ── */}
                <div className="bg-indigo-700 p-5 border-b-4 border-black flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">🏦</span>
                        <div>
                            <h2 className="text-2xl font-black text-white text-pixel uppercase leading-none">ZYND WALLET</h2>
                            <p className="text-indigo-300 mt-0.5 font-bold uppercase text-[9px] tracking-widest">n8n AI Agent · Real-time · Secure</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest">AGENT ONLINE</span>
                        </div>
                        {payStep === 'browse' && (
                            <button onClick={onClose} className="mc-button bg-stone-800 text-white w-8 h-8 text-sm border-stone-600">✕</button>
                        )}
                    </div>
                </div>

                {/* ── Tab Bar ── */}
                <div className="flex border-b-4 border-black">
                    <button
                        onClick={() => { setActiveTab('pay'); onPlaySound('select'); }}
                        className={`flex-1 py-3 font-black uppercase text-sm tracking-widest transition-colors ${activeTab === 'pay' ? 'bg-indigo-600 text-white' : 'bg-[#1a1a1a] text-white/40 hover:text-white/70'}`}
                    >
                        💳 BUY TOKENS
                    </button>
                    <button
                        onClick={() => { setActiveTab('search'); onPlaySound('select'); }}
                        className={`flex-1 py-3 font-black uppercase text-sm tracking-widest transition-colors ${activeTab === 'search' ? 'bg-indigo-600 text-white' : 'bg-[#1a1a1a] text-white/40 hover:text-white/70'}`}
                    >
                        🔍 SCHEME SEARCH
                    </button>
                </div>

                {/* ── PAY TAB ── */}
                {activeTab === 'pay' && (
                    <div className="p-6">
                        {payStep === 'browse' && (
                            <div className="space-y-4">
                                <div className="bg-indigo-950/60 border border-indigo-800/50 px-4 py-2 flex items-center justify-between">
                                    <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Wallet ID</span>
                                    <span className="text-indigo-200 font-mono text-xs font-bold">{playerEmail}</span>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {ADVISORY_PACKS.map(pack => (
                                        <button
                                            key={pack.id}
                                            onClick={() => handlePurchase(pack)}
                                            onMouseEnter={() => onPlaySound('select')}
                                            className="flex items-center justify-between p-5 bg-[#1e1e1e] border-2 border-white/10 hover:border-indigo-500 hover:bg-[#1a1a2e] transition-all group"
                                        >
                                            <div className="flex items-center gap-4 text-left">
                                                <span className="text-4xl group-hover:scale-125 transition-transform">{pack.icon}</span>
                                                <div>
                                                    <h3 className="text-xl font-black text-white uppercase leading-none">{pack.name}</h3>
                                                    <p className="text-indigo-400 font-black text-base text-pixel mt-0.5">{pack.tokens} ADVISORY TOKENS</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block text-white/30 text-[9px] font-black uppercase tracking-tighter">Price</span>
                                                <span className="text-3xl font-black text-white">₹{pack.price}</span>
                                                <span className="block text-emerald-500 text-[9px] font-black mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">[ PAY NOW → ]</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {payStep === 'processing' && (
                            <div className="py-10 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-500">
                                <div className="relative">
                                    <div className="w-20 h-20 border-8 border-indigo-900 border-t-indigo-500 rounded-full animate-spin" />
                                    <span className="absolute inset-0 flex items-center justify-center text-2xl">🏦</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-white uppercase text-pixel">PROCESSING</h3>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs max-w-xs">Contacting Zynd Pay Gateway via n8n Agent...</p>
                                </div>
                                {selectedPack && (
                                    <div className="bg-black/40 border border-white/10 p-4 w-full max-w-xs flex justify-between items-center">
                                        <span className="font-black text-white/40 text-xs uppercase">Amount</span>
                                        <span className="text-2xl font-black text-white">₹{selectedPack.price}</span>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    {['Initiating...', 'Gateway Handshake...', 'Verifying Hash...'].map((s, i) => (
                                        <span key={i} className="text-[8px] text-indigo-500/60 font-black uppercase tracking-widest animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {payStep === 'success' && (
                            <div className="py-10 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95 duration-500">
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-5xl border-8 border-black shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                                    ✓
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-black text-emerald-400 uppercase leading-none">CONFIRMED!</h3>
                                    <p className="text-white font-black uppercase text-pixel tracking-widest">
                                        +{selectedPack?.tokens} ADVISORY TOKENS CREDITED
                                    </p>
                                </div>
                                {tx && (
                                    <div className="bg-black/30 border border-emerald-900/40 p-4 w-full text-left space-y-1">
                                        <p className="text-[9px] font-black text-emerald-700 uppercase">RECEIPT ID: {tx.id}</p>
                                        <p className="text-[9px] font-black text-white/30 uppercase">Wallet: {playerEmail}</p>
                                        <p className="text-[9px] font-black text-white/30 uppercase">Verified via: Zynd n8n Agent</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ── SEARCH TAB ── */}
                {activeTab === 'search' && (
                    <div className="p-6 space-y-4">
                        {/* Search Bar */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="Search schemes... (e.g. farmer, housing, health)"
                                className="flex-1 bg-[#1a1a1a] border-2 border-white/20 text-white font-bold px-4 py-3 text-sm outline-none focus:border-indigo-500 placeholder-white/20 transition-colors"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={searchLoading}
                                className="mc-button bg-indigo-600 border-indigo-400 px-5 py-3 font-black uppercase text-sm disabled:opacity-50"
                            >
                                {searchLoading ? '⏳' : '🔍'}
                            </button>
                        </div>

                        {/* Loading */}
                        {searchLoading && (
                            <div className="flex flex-col items-center gap-3 py-8">
                                <div className="w-12 h-12 border-4 border-indigo-900 border-t-indigo-500 rounded-full animate-spin" />
                                <span className="text-indigo-400 text-xs font-black uppercase tracking-widest animate-pulse">Querying Zynd AI Agent...</span>
                            </div>
                        )}

                        {/* Results */}
                        {searchResults && !searchLoading && (
                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                                {/* Player Insight */}
                                <div className="bg-indigo-950/50 border border-indigo-800/40 p-3">
                                    <span className="text-indigo-400 text-[9px] font-black uppercase tracking-widest block mb-1">AI Insight</span>
                                    <p className="text-white/80 text-xs font-bold leading-relaxed">{searchResults.playerInsight}</p>
                                </div>

                                {/* Top Recommendations */}
                                {searchResults.topRecommendations.length > 0 && (
                                    <div>
                                        <span className="text-emerald-500 text-[9px] font-black uppercase tracking-widest block mb-2">⭐ Top Recommendations</span>
                                        <div className="flex flex-wrap gap-2">
                                            {searchResults.topRecommendations.map((r, i) => (
                                                <span key={i} className="bg-emerald-900/30 border border-emerald-700/40 px-2 py-1 text-emerald-400 text-[9px] font-black uppercase">{r}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Scheme Cards */}
                                {searchResults.schemes.map((scheme, i) => (
                                    <div key={i} className="bg-[#1a1a1a] border border-white/10 p-4 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-white font-black text-sm uppercase leading-tight max-w-[70%]">{scheme.name}</h4>
                                            <div className="text-right">
                                                <span className="block text-emerald-400 text-lg font-pixel">{scheme.approvalProbability}%</span>
                                                <span className="text-white/20 text-[8px] uppercase">Approval Chance</span>
                                            </div>
                                        </div>
                                        <p className="text-indigo-400 text-[9px] font-black uppercase">{scheme.ministry}</p>
                                        <p className="text-white/50 text-[10px] font-bold">{scheme.eligibility}</p>
                                        <div className="bg-emerald-900/20 border border-emerald-800/30 px-3 py-1.5">
                                            <span className="text-emerald-400 font-black text-[10px]">{scheme.benefits}</span>
                                        </div>
                                        <div className="flex justify-between text-[9px] text-white/30 font-bold uppercase">
                                            <span>Apply: {scheme.applyAt}</span>
                                            <span>⏱ {scheme.approvalTime}</span>
                                        </div>
                                        {/* Relevance bar */}
                                        <div className="h-1 bg-white/5 w-full">
                                            <div className="h-full bg-indigo-500 transition-all" style={{ width: `${scheme.relevanceScore}%` }} />
                                        </div>
                                    </div>
                                ))}

                                {/* Action Plan */}
                                {searchResults.actionPlan && (
                                    <div className="bg-yellow-950/30 border border-yellow-800/30 p-3">
                                        <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest block mb-1">📋 Action Plan</span>
                                        <p className="text-white/70 text-xs font-bold leading-relaxed">{searchResults.actionPlan}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {!searchResults && !searchLoading && (
                            <div className="text-center py-8 text-white/20 font-bold uppercase text-xs tracking-widest">
                                <span className="text-4xl block mb-3">🔍</span>
                                Search for any welfare scheme, benefit, or entitlement.<br />
                                Powered by Zynd AI Agent (n8n).
                            </div>
                        )}
                    </div>
                )}

                {/* ── Footer ── */}
                <div className="bg-black p-3 border-t-4 border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-white/30 text-[8px] font-black uppercase tracking-widest">GATEWAY SECURE · n8n Agent v1</span>
                    </div>
                    <span className="text-white/10 text-[8px] font-bold uppercase">Zynd Multi-Party Protocol</span>
                </div>
            </div>
        </div>
    );
};

export default ZyndPayModal;
