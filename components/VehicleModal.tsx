import React from 'react';
import { VehicleType } from '../types';

interface VehicleModalProps {
  currentVehicle: VehicleType;
  onSelect: (v: VehicleType) => void;
  onClose: () => void;
  onPlaySound: (type: any) => void;
}

const VEHICLES: { type: VehicleType; label: string; icon: string; desc: string; speedMod: string; cost: number }[] = [
  { type: 'caravan', label: 'Caravan', icon: '📦', desc: 'The classic hauler. Balanced and reliable.', speedMod: '100%', cost: 0 },
  { type: 'bike', label: 'Sand Bike', icon: '🏍️', desc: 'Fast and nimble. Low consumption, but limited space.', speedMod: '140%', cost: 50 },
  { type: 'car', label: 'Wasteland Car', icon: '🚗', desc: 'A repurposed scout car. Smooth riding.', speedMod: '120%', cost: 100 },
  { type: 'truck', label: 'Heavy Truck', icon: '🚛', desc: 'Slower, but can carry a full crew with ease.', speedMod: '80%', cost: 200 },
  { type: 'train', label: 'Chunk Train', icon: '🚂', desc: 'Extremely fast and massive, but burns resources.', speedMod: '160%', cost: 500 },
];

const VehicleModal: React.FC<VehicleModalProps> = ({ currentVehicle, onSelect, onClose, onPlaySound }) => {
  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-4 z-[100] backdrop-blur-md animate-in fade-in duration-300">
      <div className="mc-container max-w-4xl w-full flex flex-col overflow-hidden border-[8px] border-black shadow-[0_0_100px_rgba(0,0,0,0.8)]">
        <div className="bg-emerald-600 p-6 border-b-8 border-black">
          <h2 className="text-5xl md:text-7xl font-black text-center text-white text-pixel uppercase leading-none italic">VEHICLE HANGAR</h2>
          <p className="text-center text-emerald-200 text-xl font-bold uppercase mt-2 tracking-widest">Select your transport across the crossroads</p>
        </div>

        <div className="bg-[#c6c6c6] p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[60vh] fancy-scrollbar">
          {VEHICLES.map((v) => (
            <button
              key={v.type}
              onClick={() => {
                onPlaySound('confirm');
                onSelect(v.type);
              }}
              onMouseEnter={() => onPlaySound('select')}
              className={`group flex flex-col p-4 border-4 border-black transition-all duration-100 text-left relative ${
                currentVehicle === v.type 
                  ? 'bg-yellow-400 shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)]' 
                  : 'bg-[#999] hover:bg-[#bbb] shadow-[4px_4px_0px_#000]'
              }`}
            >
              {currentVehicle === v.type && (
                <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-black p-1 border-2 border-black rotate-12 z-10 animate-pulse">ACTIVE</div>
              )}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 bg-white/40 border-4 border-black flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black uppercase text-pixel leading-none">{v.label}</h3>
                  <p className="text-xs font-bold text-black/60 uppercase mt-1">Speed: {v.speedMod}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-stone-800 leading-tight border-t-2 border-black/10 pt-2">{v.desc}</p>
              {v.cost > 0 && currentVehicle !== v.type && (
                <div className="mt-3 flex justify-between items-center">
                   <span className="text-sm font-black bg-black text-yellow-400 px-2 py-0.5 border border-yellow-400/50 italic">COST: {v.cost}G</span>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="bg-[#3a3a3a] p-6 border-t-8 border-black flex gap-4">
          <button
            onClick={onClose}
            onMouseEnter={() => onPlaySound('select')}
            className="mc-button flex-1 text-3xl py-4 bg-amber-600 hover:bg-amber-500 border-amber-300 font-black uppercase text-pixel shadow-[0_6px_0_#92400e]"
          >
            RETURN TO ROAD [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;