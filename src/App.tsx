import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MainDisplay } from './components/MainDisplay';
import { QuickButtons } from './components/QuickButtons';
import { ManualInputSection } from './components/ManualInputSection';
import { BanknoteCounter } from './components/BanknoteCounter';
import { HistoryDrawer } from './components/HistoryDrawer';
import { HistoryItem, OperationType } from './types';
import { formatUzbekSom, sound } from './utils/formatters';
import { Info, HelpCircle } from 'lucide-react';

const STORAGE_KEY_BALANCE = 'my_money_calc_balance';
const STORAGE_KEY_HISTORY = 'my_money_calc_history';
const STORAGE_KEY_SOUND = 'my_money_calc_sound';

export default function App() {
  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
      return saved !== null ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'calculator' | 'banknotes' | 'history'>('calculator');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [showInfo, setShowInfo] = useState<boolean>(false);

  // Sync sound preference
  useEffect(() => {
    sound.enabled = soundEnabled;
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, soundEnabled.toString());
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  // Sync balance to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
    } catch {
      // ignore
    }
  }, [balance]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
    } catch {
      // ignore
    }
  }, [history]);

  const addHistoryEntry = (
    type: HistoryItem['type'],
    amount: number,
    prev: number,
    next: number,
    description: string
  ) => {
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      timestamp: new Date(),
      type,
      amount,
      previousBalance: prev,
      newBalance: next,
      description,
    };
    setHistory((prevHistory) => [newItem, ...prevHistory.slice(0, 49)]);
  };

  const handleQuickAdd = (amount: number) => {
    setBalance((prev) => {
      const next = prev + amount;
      addHistoryEntry('quick_add', amount, prev, next, `+${formatUzbekSom(amount)} so'm qo'shildi`);
      return next;
    });
  };

  const handleQuickSubtract = (amount: number) => {
    setBalance((prev) => {
      const next = prev - amount;
      addHistoryEntry('quick_sub', amount, prev, next, `-${formatUzbekSom(amount)} so'm ayirildi`);
      return next;
    });
  };

  const handleSetBalanceDirect = (newBalance: number) => {
    const prev = balance;
    setBalance(newBalance);
    addHistoryEntry('set', newBalance, prev, newBalance, `Balans ${formatUzbekSom(newBalance)} so'm qilib belgilandi`);
  };

  const handleManualExecute = (amount: number, type: OperationType) => {
    setBalance((prev) => {
      let next = prev;
      let desc = '';
      if (type === 'add') {
        next = prev + amount;
        desc = `+${formatUzbekSom(amount)} so'm qo'shildi`;
      } else if (type === 'subtract') {
        next = prev - amount;
        desc = `-${formatUzbekSom(amount)} so'm ayirildi`;
      } else {
        next = amount;
        desc = `${formatUzbekSom(amount)} so'm qilib belgilandi`;
      }
      addHistoryEntry(type, amount, prev, next, desc);
      return next;
    });
  };

  const handleClearAll = () => {
    const prev = balance;
    setBalance(0);
    addHistoryEntry('clear', 0, prev, 0, "Barcha balans tozalandi (0 so'm)");
  };

  const handleApplyPercentage = (percent: number) => {
    setBalance((prev) => {
      const diff = Math.round((prev * percent) / 100);
      const next = prev + diff;
      addHistoryEntry(
        'percentage',
        Math.abs(diff),
        prev,
        next,
        `${percent > 0 ? `+${percent}%` : `${percent}%`} (${formatUzbekSom(Math.abs(diff))} so'm) hisoblandi`
      );
      return next;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // ignore
    }
  };

  const handleRestoreFromHistory = (targetBalance: number) => {
    const prev = balance;
    setBalance(targetBalance);
    addHistoryEntry('set', targetBalance, prev, targetBalance, `Tarixdan ${formatUzbekSom(targetBalance)} so'm tiklandi`);
    setActiveTab('calculator');
  };

  const handleApplyBanknotesToMain = (total: number) => {
    const prev = balance;
    setBalance(total);
    addHistoryEntry('set', total, prev, total, `Kupyuralar bo'yicha jami ${formatUzbekSom(total)} so'm o'rnatildi`);
    setActiveTab('calculator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8 space-y-6">
        {/* Main Display (Always visible or central) */}
        <MainDisplay
          balance={balance}
          onSetBalance={handleSetBalanceDirect}
        />

        {/* Tab 1: Standard Calculator & Buttons (Features 1-8) */}
        {activeTab === 'calculator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick + and - buttons (1k, 5k, 10k, 50k, 100k so'm) */}
            <QuickButtons
              onAdd={handleQuickAdd}
              onSubtract={handleQuickSubtract}
            />

            {/* Manual input, Hisoblash & Tozalash */}
            <ManualInputSection
              currentBalance={balance}
              onExecute={handleManualExecute}
              onClearAll={handleClearAll}
              onApplyPercentage={handleApplyPercentage}
            />
          </div>
        )}

        {/* Tab 2: Banknote Counter (Cash drawer & stack counting) */}
        {activeTab === 'banknotes' && (
          <div className="animate-in fade-in duration-200">
            <BanknoteCounter onApplyToMain={handleApplyBanknotesToMain} />
          </div>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="animate-in fade-in duration-200">
            <HistoryDrawer
              history={history}
              onClearHistory={handleClearHistory}
              onRestoreBalance={handleRestoreFromHistory}
            />
          </div>
        )}

        {/* Quick Tips / Keyboard guide */}
        <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-4 text-xs text-slate-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-slate-300">
              Qulayliklar:
            </p>
            <p>
              • Kiritish maydonida raqam yozib <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">Enter</kbd> tugmasini bossangiz, darhol <b>Hisoblash</b> bajariladi.
            </p>
            <p>
              • Barcha sonlar o'zbek so'mi standartiga mos ravishda oraliq bo'sh joylar bilan (masalan: <b>100 000 so'm</b>) formatlanadi.
            </p>
            <p>
              • Katta raqam ustiga bosib, summani to'g'ridan-to'g'ri o'zgartirishingiz mumkin.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>My Money Calculator — O'zbek so'mi (UZS)</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Yordam va ma'lumot</span>
            </button>
            <span>Avtomatik saqlanadi</span>
          </div>
        </div>
      </footer>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Ilova haqida</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-300 space-y-2.5 leading-relaxed">
              <p>
                <b>My Money Calculator</b> — o'zbek so'mida har qanday kundalik hisob-kitoblar, daromadlar, xarajatlar va kassa pullarini sanash uchun mo'ljallangan zamonaviy kalkulyator.
              </p>
              <p>
                <b>Asosiy imkoniyatlar:</b>
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-400">
                <li>+1 000, +5 000, +10 000, +50 000, +100 000 so'm tezkor qo'shish</li>
                <li>-1 000, -5 000, -10 000, -50 000, -100 000 so'm tezkor ayirish</li>
                <li>Ixtiyoriy summani kiritish va «Hisoblash» tugmasi</li>
                <li>«Tozalash» tugmasi orqali hisobni 0 qilish</li>
                <li>Sonlarni oraliq bo'sh joylar bilan ko'rsatish (100 000 so'm)</li>
                <li>Summani so'z bilan o'zbek tilida ifodalash</li>
                <li>Kupyuralarni (qog'oz pullarni) dona-dona va bog'lamlab sanash</li>
                <li>Barcha amallar tarixi va tiklash imkoniyati</li>
              </ul>
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
