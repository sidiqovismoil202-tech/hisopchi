import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownRight, RotateCcw, Clock, ShieldAlert } from 'lucide-react';
import { HistoryItem } from '../types';
import { formatUzbekSom, sound } from '../utils/formatters';

interface HistoryDrawerProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onRestoreBalance: (amount: number) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onClearHistory,
  onRestoreBalance,
}) => {
  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <span>Hisob-kitoblar tarixi</span>
          </h2>
          <p className="text-xs text-slate-400">
            Kalkulyatorda bajarilgan barcha amallar ro'yxati
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              sound.playClear();
              onClearHistory();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Tarixni tozalash</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
          <Clock className="w-10 h-10 stroke-[1.5] text-slate-600 mb-1" />
          <p className="text-sm font-semibold text-slate-400">Hozircha amallar tarixi yo'q</p>
          <p className="text-xs max-w-xs text-slate-500">
            Tugmalarni bosganingizda yoki summani hisoblaganingizda bu yerda yozib boriladi.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/80 max-h-[500px] overflow-y-auto pr-1">
          {history.map((item) => {
            const isPositive = item.newBalance > item.previousBalance;
            const isNegative = item.newBalance < item.previousBalance;
            const isClear = item.type === 'clear';

            const timeStr = item.timestamp.toLocaleTimeString('uz-UZ', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="py-3 sm:py-3.5 flex items-center justify-between gap-3 hover:bg-slate-800/30 px-2 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isClear
                        ? 'bg-rose-500/10 text-rose-400'
                        : isPositive
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isClear ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : isPositive ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {item.description}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                        {timeStr}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 font-mono-numbers">
                      <span>{formatUzbekSom(item.previousBalance)}</span>
                      <span>→</span>
                      <span className="font-bold text-slate-200">
                        {formatUzbekSom(item.newBalance)} so'm
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onRestoreBalance(item.newBalance);
                    }}
                    title="Ushbu summani tiklash"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
