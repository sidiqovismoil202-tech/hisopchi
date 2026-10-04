import React from 'react';
import { Wallet, Volume2, VolumeX, History, Banknote, Calculator } from 'lucide-react';
import { sound } from '../utils/formatters';

interface HeaderProps {
  activeTab: 'calculator' | 'banknotes' | 'history';
  setActiveTab: (tab: 'calculator' | 'banknotes' | 'history') => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  historyCount,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    sound.enabled = next;
    setSoundEnabled(next);
    if (next) sound.playClick();
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold ring-1 ring-white/20">
            <Wallet className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                My Money Calculator
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                UZS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              O'zbek so'mida tezkor va oson hisob-kitob
            </p>
          </div>
        </div>

        {/* Navigation Tabs and Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('calculator');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'calculator'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Kalkulyator</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('banknotes');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'banknotes'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Kupyuralar</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('history');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all relative ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Tarix</span>
              {historyCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'history' ? 'bg-slate-900 text-white' : 'bg-slate-800 text-emerald-400'
                }`}>
                  {historyCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={toggleSound}
            title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
            className="p-2 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-400 hover:text-white hover:border-slate-700 transition"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
