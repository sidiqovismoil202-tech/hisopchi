import React, { useState } from 'react';
import { Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { formatUzbekSom, sound } from '../utils/formatters';

interface QuickButtonsProps {
  onAdd: (amount: number) => void;
  onSubtract: (amount: number) => void;
}

const PRIMARY_AMOUNTS = [1000, 5000, 10000, 50000, 100000];
const EXTRA_AMOUNTS = [200000, 500000, 1000000];

export const QuickButtons: React.FC<QuickButtonsProps> = ({ onAdd, onSubtract }) => {
  const [showExtras, setShowExtras] = useState(false);

  const handleAdd = (amount: number) => {
    sound.playClick();
    onAdd(amount);
  };

  const handleSub = (amount: number) => {
    sound.playClick();
    onSubtract(amount);
  };

  const activeAmounts = showExtras ? [...PRIMARY_AMOUNTS, ...EXTRA_AMOUNTS] : PRIMARY_AMOUNTS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          Tezkor tugmalar
        </h2>
        <button
          onClick={() => {
            sound.playClick();
            setShowExtras(!showExtras);
          }}
          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition"
        >
          <span>{showExtras ? "Kamroq ko'rsatish" : "Katta summalar (+200k, +500k, +1M)"}</span>
          {showExtras ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PLUS BUTTONS */}
        <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/20 p-4 sm:p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/10">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Qo'shish tugmalari (+)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeAmounts.map((amount) => (
              <button
                key={`add-${amount}`}
                onClick={() => handleAdd(amount)}
                className="group relative flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 border border-emerald-500/30 hover:border-emerald-500/60 active:scale-[0.98] transition-all duration-150 text-left cursor-pointer shadow-sm hover:shadow-emerald-500/10"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 flex items-center justify-center text-xs font-bold transition-colors">
                    +
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base font-mono-numbers">
                    +{formatUzbekSom(amount)}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400/80">
                  so'm
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* MINUS BUTTONS */}
        <div className="rounded-2xl bg-slate-900/80 border border-rose-500/20 p-4 sm:p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-rose-500/10">
            <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Minus className="w-4 h-4 stroke-[3]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Ayirish tugmalari (-)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {activeAmounts.map((amount) => (
              <button
                key={`sub-${amount}`}
                onClick={() => handleSub(amount)}
                className="group relative flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-800/80 hover:bg-rose-600/20 border border-rose-500/30 hover:border-rose-500/60 active:scale-[0.98] transition-all duration-150 text-left cursor-pointer shadow-sm hover:shadow-rose-500/10"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-rose-500/20 group-hover:bg-rose-500 group-hover:text-slate-950 text-rose-400 flex items-center justify-center text-xs font-bold transition-colors">
                    -
                  </span>
                  <span className="font-bold text-white text-sm sm:text-base font-mono-numbers">
                    -{formatUzbekSom(amount)}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-rose-400/80">
                  so'm
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
