
import React from 'react';
import { Document, ResourceState } from '../types';

interface DocumentInventoryProps {
    resources: ResourceState;
    onClose: () => void;
    onPlaySound: (type: any) => void;
    onUpdateStatus: (docId: string, status: Document['status']) => void;
}

const DocumentInventory: React.FC<DocumentInventoryProps> = ({ resources, onClose, onPlaySound, onUpdateStatus }) => {
    return (
        <div className="absolute inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="mc-container max-w-3xl w-full flex flex-col overflow-hidden animate-in zoom-in-95 border-[8px] border-black">
                <div className="bg-indigo-700 p-6 border-b-6 border-black flex justify-between items-center shadow-[inset_0_4px_0_rgba(255,255,255,0.2)]">
                    <div className="flex items-center gap-4">
                        <span className="text-4xl">📂</span>
                        <div>
                            <h2 className="text-4xl font-black text-white text-pixel uppercase leading-none">DOCUMENT INVENTORY</h2>
                            <p className="text-indigo-200 mt-1 font-bold uppercase text-xs tracking-widest">Protocol Identification & Verification Hub</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="mc-button bg-stone-800 text-white p-2 border-stone-600">X</button>
                </div>

                <div className="bg-[#c6c6c6] p-8 space-y-6 flex-1 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resources.documents.map(doc => (
                            <div key={doc.id} className="bg-black/10 border-4 border-black/20 p-4 space-y-4 hover:bg-black/5 transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-black text-stone-900 uppercase leading-none">{doc.name}</h4>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${doc.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' :
                                                    doc.status === 'expired' ? 'bg-red-500' : 'bg-amber-500'
                                                }`} />
                                            <span className="text-[10px] font-black uppercase text-stone-600 tracking-tighter italic">Status: {doc.status}</span>
                                        </div>
                                    </div>
                                    <div className="text-2xl group-hover:rotate-12 transition-transform">📄</div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    {doc.status !== 'active' && (
                                        <button
                                            onClick={() => {
                                                onPlaySound('confirm');
                                                onUpdateStatus(doc.id, 'active');
                                            }}
                                            className="mc-button py-2 bg-emerald-600 border-emerald-400 text-[10px] font-black uppercase"
                                        >
                                            UPDATE (1 MO)
                                        </button>
                                    )}
                                    <button className="mc-button py-2 bg-[#777] border-[#999] text-[10px] font-black uppercase opacity-50 cursor-not-allowed">
                                        PREVIEW
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-indigo-900/10 border-4 border border-dashed border-indigo-900/30 p-6 rounded-2xl flex flex-col items-center text-center">
                        <span className="text-4xl mb-2 opacity-50">➕</span>
                        <h5 className="text-lg font-black text-indigo-900 uppercase">ACQUIRE NEW PROTOCOL</h5>
                        <p className="text-indigo-900/60 text-[10px] font-bold uppercase mt-1 max-w-xs">Specific schemes require unique documentation. These can be acquired through Sector Offices in-game.</p>
                    </div>
                </div>

                <div className="bg-[#3a3a3a] p-4 text-center border-t-8 border-black">
                    <p className="text-white/40 font-bold uppercase text-[9px] tracking-widest leading-loose">
                        "Expired documentation reduces approval probability by 40%. Keep your inventory protocol-compliant."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentInventory;
