import React, { useState } from 'react';
import { Copy, Check, Edit3, ArrowRight } from 'lucide-react';
import { formatUzbekSom, numberToUzbekWords, sound, parseSomInput } from '../utils/formatters';

interface MainDisplayProps {
  balance: number;
  onSetBalance: (newBalance: number) => void;
  usdRate?: number;
}

export const MainDisplay: React.FC<MainDisplayProps> = ({
  balance,
  onSetBalance,
  usdRate = 12850,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const formattedBalance = formatUzbekSom(balance);
  const wordsRepresentation = numberToUzbekWords(balance);
  const approxUsd = balance > 0 && usdRate > 0 ? (balance / usdRate).toFixed(2) : '0.00';

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(`${formattedBalance} so'm (${wordsRepresentation})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEdit = () => {
    sound.playClick();
    setEditValue(balance.toString());
    setIsEditing(true);
  };

  const saveEdit = () => {
    sound.playCalculate();
    const parsed = parseSomInput(editValue);
    onSetBalance(parsed);
    setIsEditing(false);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-emerald-500/20 shadow-2xl shadow-emerald-950/20 p-6 sm:p-8 transition-all">
      {/* Background ambient decorative light */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Umumiy mablag'
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono-numbers">
            ≈ ${approxUsd} USD
          </span>
        </div>

        {/* Large Amount Display or Direct Edit Mode */}
        {isEditing ? (
          <div className="my-2 w-full max-w-md flex flex-col items-center gap-3">
            <label className="text-xs text-slate-400 font-medium">
              Yangi summani kiriting:
            </label>
            <div className="relative w-full">
              <input
                type="text"
                autoFocus
                value={editValue ? formatUzbekSom(editValue) : ''}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^\d-]/g, '');
                  setEditValue(cleaned);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                placeholder="0"
                className="w-full text-center text-3xl sm:text-4xl font-extrabold text-white bg-slate-800/80 border-2 border-emerald-500 rounded-2xl py-3 px-4 focus:outline-none shadow-inner font-mono-numbers"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-emerald-400 font-bold">
                so'm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={saveEdit}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
              >
                <span>Saqlash</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={startEdit}
            title="Summani to'g'ridan-to'g'ri o'zgartirish uchun bosing"
            className="group cursor-pointer my-2 flex flex-col items-center select-none"
          >
            <div className="flex flex-wrap items-baseline justify-center gap-2 sm:gap-3 transition-transform duration-200 group-hover:scale-[1.02]">
              <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md font-mono-numbers">
                {formattedBalance}
              </span>
              <span className="text-xl sm:text-3xl font-bold text-emerald-400 tracking-normal">
                so'm
              </span>
              <Edit3 className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors opacity-0 group-hover:opacity-100 hidden sm:inline-block" />
            </div>
          </div>
        )}

        {/* Written representation in Uzbek */}
        <div className="mt-2 max-w-xl px-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800/70 text-slate-300 text-xs sm:text-sm font-medium leading-relaxed italic text-center">
          « {wordsRepresentation} »
        </div>

        {/* Action buttons (Copy, edit indicator) */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Nusxalandi!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Nusxa olish</span>
              </>
            )}
          </button>

          {!isEditing && (
            <button
              onClick={startEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>O'zgartirish</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
