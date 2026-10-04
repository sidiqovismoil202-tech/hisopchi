import React, { useState } from 'react';
import { Calculator, RotateCcw, X, Plus, Minus, Equal, Percent } from 'lucide-react';
import { formatUzbekSom, parseSomInput, numberToUzbekWords, sound } from '../utils/formatters';
import { OperationType } from '../types';

interface ManualInputSectionProps {
  currentBalance: number;
  onExecute: (amount: number, type: OperationType) => void;
  onClearAll: () => void;
  onApplyPercentage: (percent: number) => void;
}

export const ManualInputSection: React.FC<ManualInputSectionProps> = ({
  currentBalance,
  onExecute,
  onClearAll,
  onApplyPercentage,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [operation, setOperation] = useState<OperationType>('add');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const numericValue = parseSomInput(inputValue);
  const wordsPreview = numericValue > 0 ? numberToUzbekWords(numericValue) : '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    if (!raw) {
      setInputValue('');
      return;
    }
    const num = parseInt(raw, 10);
    setInputValue(formatUzbekSom(num));
  };

  const handleHisoblash = () => {
    if (numericValue <= 0) return;
    sound.playCalculate();
    onExecute(numericValue, operation);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleHisoblash();
    }
  };

  const handleClearField = () => {
    sound.playClick();
    setInputValue('');
  };

  const handleTozalashClick = () => {
    sound.playClear();
    if (currentBalance !== 0 || inputValue !== '') {
      setShowClearConfirm(true);
    } else {
      setInputValue('');
    }
  };

  const confirmClearAll = () => {
    sound.playClear();
    setInputValue('');
    onClearAll();
    setShowClearConfirm(false);
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <span>Ixtiyoriy summani kiritish</span>
          </h2>
          <p className="text-xs text-slate-400">
            Xohlagan miqdorni yozing va amalni tanlang
          </p>
        </div>

        {/* Operation mode selector tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setOperation('add');
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              operation === 'add'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mavjud summaga qo'shish"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Qo'shish</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setOperation('subtract');
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              operation === 'subtract'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mavjud summadan ayirish"
          >
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Ayirish</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setOperation('set');
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              operation === 'set'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Yangi summa sifatida o'rnatish"
          >
            <Equal className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">O'rnatish</span>
          </button>
        </div>
      </div>

      {/* Input Field with live formatting */}
      <div className="space-y-2">
        <div className="relative flex items-center">
          <input
            type="text"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="0"
            className="w-full text-2xl sm:text-3xl font-extrabold text-white bg-slate-950 border-2 border-slate-700/80 focus:border-emerald-500 rounded-2xl py-3.5 pl-4 pr-24 focus:outline-none transition-all shadow-inner font-mono-numbers"
          />

          <div className="absolute right-4 flex items-center gap-2">
            {inputValue && (
              <button
                type="button"
                onClick={handleClearField}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Maydonni tozalash"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <span className="text-sm font-bold text-emerald-400 pointer-events-none">
              so'm
            </span>
          </div>
        </div>

        {/* Live words preview */}
        {wordsPreview && (
          <div className="text-xs text-slate-400 font-medium italic pl-1 flex items-center gap-1.5">
            <span className="text-emerald-500 font-bold">So'z bilan:</span>
            <span>{wordsPreview}</span>
          </div>
        )}
      </div>

      {/* Percentage quick chips */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Percent className="w-3 h-3" /> Foiz:
        </span>
        {[5, 10, 15, 20].map((p) => (
          <button
            key={`p-${p}`}
            onClick={() => {
              sound.playClick();
              onApplyPercentage(p);
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700/50 transition font-mono-numbers"
          >
            +{p}%
          </button>
        ))}
        {[-5, -10, -20].map((p) => (
          <button
            key={`m-${p}`}
            onClick={() => {
              sound.playClick();
              onApplyPercentage(p);
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700/50 transition font-mono-numbers"
          >
            {p}%
          </button>
        ))}
      </div>

      {/* Action Buttons: Hisoblash and Tozalash */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* HISOBLASH BUTTON (Feature 6) */}
        <button
          type="button"
          onClick={handleHisoblash}
          disabled={numericValue <= 0}
          className={`sm:col-span-2 relative flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-extrabold text-base sm:text-lg transition-all shadow-lg duration-150 active:scale-[0.98] ${
            numericValue > 0
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/25 cursor-pointer ring-2 ring-emerald-400/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
          }`}
        >
          <Calculator className="w-5 h-5 stroke-[2.5]" />
          <span>Hisoblash</span>
          {numericValue > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-950/20 text-slate-950 ml-1 font-mono-numbers">
              {operation === 'add' ? `+${formatUzbekSom(numericValue)}` : operation === 'subtract' ? `-${formatUzbekSom(numericValue)}` : `=${formatUzbekSom(numericValue)}`}
            </span>
          )}
        </button>

        {/* TOZALASH BUTTON (Feature 7) */}
        <button
          type="button"
          onClick={handleTozalashClick}
          className="flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-bold text-sm sm:text-base bg-slate-800/80 hover:bg-rose-500/15 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Tozalash</span>
        </button>
      </div>

      {/* Confirmation modal for Tozalash */}
      {showClearConfirm && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in zoom-in-95">
          <div className="text-xs sm:text-sm text-slate-200 text-center sm:text-left">
            <span className="font-bold text-rose-400">Barcha hisobni tozalash</span>ni xohlaysizmi? Balans 0 so'mga tenglashtiriladi.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={confirmClearAll}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
            >
              Ha, tozalansin
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-medium text-xs transition"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
