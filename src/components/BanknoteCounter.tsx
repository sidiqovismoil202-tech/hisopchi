import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, ArrowRight, Banknote } from 'lucide-react';
import { UZBEK_BANKNOTES } from '../types';
import { formatUzbekSom, numberToUzbekWords, sound } from '../utils/formatters';

interface BanknoteCounterProps {
  onApplyToMain: (total: number) => void;
}

export const BanknoteCounter: React.FC<BanknoteCounterProps> = ({ onApplyToMain }) => {
  const [counts, setCounts] = useState<Record<number, number>>({
    200000: 0,
    100000: 0,
    50000: 0,
    20000: 0,
    10000: 0,
    5000: 0,
    2000: 0,
    1000: 0,
  });

  const totalSum = UZBEK_BANKNOTES.reduce((acc, note) => {
    return acc + (counts[note.value] || 0) * note.value;
  }, 0);

  const totalBanknotesCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const updateCount = (value: number, delta: number) => {
    sound.playClick();
    setCounts((prev) => {
      const current = prev[value] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [value]: next };
    });
  };

  const setCountDirect = (value: number, countStr: string) => {
    const parsed = parseInt(countStr.replace(/\D/g, ''), 10) || 0;
    setCounts((prev) => ({ ...prev, [value]: Math.max(0, parsed) }));
  };

  const handleReset = () => {
    sound.playClear();
    setCounts({
      200000: 0,
      100000: 0,
      50000: 0,
      20000: 0,
      10000: 0,
      5000: 0,
      2000: 0,
      1000: 0,
    });
  };

  const handleTransfer = () => {
    sound.playCalculate();
    onApplyToMain(totalSum);
  };

  return (
    <div className="space-y-6">
      {/* Header Total for Banknotes */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
            <Banknote className="w-4 h-4" />
            Kupyuralar bo'yicha jami
          </span>
          <div className="flex items-baseline gap-2 font-mono-numbers">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">
              {formatUzbekSom(totalSum)}
            </span>
            <span className="text-lg font-bold text-emerald-400">so'm</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 italic">
            {totalSum > 0 ? numberToUzbekWords(totalSum) : '0 dona kupyura'}
            {totalBanknotesCount > 0 && ` (${totalBanknotesCount} dona qog'oz pul)`}
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={handleTransfer}
            disabled={totalSum <= 0}
            className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg ${
              totalSum > 0
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>Kalkulyatorga o'tkazish</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
            title="Kupyuralarni nollashtirish"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid of Banknotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {UZBEK_BANKNOTES.map((note) => {
          const count = counts[note.value] || 0;
          const subtotal = count * note.value;

          return (
            <div
              key={note.value}
              className={`p-4 rounded-2xl bg-slate-900/90 border transition-all ${
                count > 0 ? 'border-emerald-500/40 bg-slate-900' : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-lg bg-gradient-to-r ${note.color} border border-white/10 font-bold text-xs ${note.accent}`}>
                    {note.label}
                  </div>
                  <span className="text-xs text-slate-400">kupyura</span>
                </div>

                <div className="text-right font-mono-numbers">
                  <span className="text-sm font-bold text-white">
                    {formatUzbekSom(subtotal)}
                  </span>
                  <span className="text-[11px] text-slate-400 ml-1">so'm</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                {/* Counter buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateCount(note.value, -1)}
                    disabled={count === 0}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition border border-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    value={count === 0 ? '' : count}
                    placeholder="0"
                    onChange={(e) => setCountDirect(note.value, e.target.value)}
                    className="w-16 h-8 text-center bg-slate-950 border border-slate-700 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-emerald-500 font-mono-numbers"
                  />

                  <button
                    onClick={() => updateCount(note.value, 1)}
                    className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition border border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick bundle buttons */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateCount(note.value, 10)}
                    className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700"
                    title="+10 dona"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => updateCount(note.value, 100)}
                    className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold border border-emerald-500/20"
                    title="1 bog'lam (100 dona)"
                  >
                    +100 dona (bog'lam)
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
