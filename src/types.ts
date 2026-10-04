export type OperationType = 'add' | 'subtract' | 'set';

export interface HistoryItem {
  id: string;
  timestamp: Date;
  type: OperationType | 'quick_add' | 'quick_sub' | 'clear' | 'percentage';
  amount: number;
  previousBalance: number;
  newBalance: number;
  description: string;
}

export interface BanknoteDenomination {
  value: number;
  label: string;
  color: string;
  accent: string;
}

export const UZBEK_BANKNOTES: BanknoteDenomination[] = [
  { value: 200000, label: "200 000 so'm", color: "from-teal-600/30 to-teal-900/40", accent: "text-teal-400" },
  { value: 100000, label: "100 000 so'm", color: "from-amber-600/30 to-amber-900/40", accent: "text-amber-400" },
  { value: 50000, label: "50 000 so'm", color: "from-purple-600/30 to-purple-900/40", accent: "text-purple-400" },
  { value: 20000, label: "20 000 so'm", color: "from-blue-600/30 to-blue-900/40", accent: "text-blue-400" },
  { value: 10000, label: "10 000 so'm", color: "from-pink-600/30 to-pink-900/40", accent: "text-pink-400" },
  { value: 5000, label: "5 000 so'm", color: "from-emerald-600/30 to-emerald-900/40", accent: "text-emerald-400" },
  { value: 2000, label: "2 000 so'm", color: "from-cyan-600/30 to-cyan-900/40", accent: "text-cyan-400" },
  { value: 1000, label: "1 000 so'm", color: "from-slate-600/30 to-slate-900/40", accent: "text-slate-400" },
];
