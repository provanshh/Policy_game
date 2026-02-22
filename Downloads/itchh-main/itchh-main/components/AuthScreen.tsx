
import React, { useState } from 'react';
import { PlayerProfile } from '../types';

interface AuthScreenProps {
    onComplete: (profile: PlayerProfile) => void;
    onPlaySound: (type: any) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onComplete, onPlaySound }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [state, setState] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !contact || !state) return;

        onPlaySound('confirm');
        onComplete({
            name,
            contact,
            state,
            id: Math.random().toString(36).substr(2, 9),
            literacyScore: 0,
            optimizationScore: 0,
            advisoryTokens: 5, // Start with some tokens
            transactions: []
        });
    };

    return (
        <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl">
            <div className="mc-container max-w-2xl w-full p-0 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.2)] border-[8px] border-black">
                <div className="bg-emerald-600 p-8 border-b-8 border-black text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white text-pixel uppercase leading-none">REGISTRY ENTRY</h2>
                    <p className="text-emerald-200 mt-2 font-bold uppercase tracking-[0.3em] text-xs">Benefit Navigator Authentication Protocol</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#c6c6c6] p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xl font-black text-stone-800 uppercase text-pixel">Full Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 bg-white border-4 border-black text-2xl font-bold text-stone-900 placeholder-stone-400 focus:bg-emerald-50 outline-none transition-colors"
                            placeholder="ENTER LEGAL NAME..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xl font-black text-stone-800 uppercase text-pixel">Contact (Mobile/Email)</label>
                        <input
                            required
                            type="text"
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            className="w-full p-4 bg-white border-4 border-black text-2xl font-bold text-stone-900 placeholder-stone-400 focus:bg-emerald-50 outline-none transition-colors"
                            placeholder="SYNC ID FOR LEADERBOARD..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xl font-black text-stone-800 uppercase text-pixel">State / Sector</label>
                        <select
                            required
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full p-4 bg-white border-4 border-black text-2xl font-bold text-stone-900 focus:bg-emerald-50 outline-none transition-colors appearance-none"
                        >
                            <option value="" className="text-stone-400">SELECT SECTOR...</option>
                            <option value="Delhi" className="text-stone-900">Sector: Delhi</option>
                            <option value="Punjab" className="text-stone-900">Sector: Punjab</option>
                            <option value="Haryana" className="text-stone-900">Sector: Haryana</option>
                            <option value="Maharashtra" className="text-stone-900">Sector: Maharashtra</option>
                            <option value="Karnataka" className="text-stone-900">Sector: Karnataka</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        onMouseEnter={() => onPlaySound('select')}
                        className="mc-button w-full py-6 mt-4 bg-emerald-600 hover:bg-emerald-500 text-3xl font-black text-white border-4 border-black shadow-[0_8px_0_#064e3b]"
                    >
                        INITIALIZE PROFILE
                    </button>
                </form>

                <div className="bg-[#8b8b8b] p-4 text-center border-t-8 border-black">
                    <p className="text-stone-900 font-bold uppercase text-xs tracking-widest">Authorized use only. Data subject to regional audit.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
