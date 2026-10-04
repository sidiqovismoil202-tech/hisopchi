/**
 * Formats a number with spaces as thousands separators.
 * Example: 1000000 -> "1 000 000"
 */
export function formatUzbekSom(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/\s+/g, '')) || 0 : value;
  if (isNaN(num)) return '0';
  
  const isNegative = num < 0;
  const absNum = Math.abs(Math.round(num));
  const parts = absNum.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  
  return (isNegative ? '-' : '') + parts.join('.');
}

/**
 * Strips all non-digit characters (allowing optional negative sign) and returns number.
 */
export function parseSomInput(input: string): number {
  const cleaned = input.replace(/[^\d-]/g, '');
  if (!cleaned || cleaned === '-') return 0;
  const parsed = parseInt(cleaned, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats input string cleanly as user types
 */
export function formatInputDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';
  const num = parseInt(digits, 10);
  return formatUzbekSom(num);
}

/**
 * Converts a number to Uzbek words.
 * E.g., 150000 -> "Bir yuz ellik ming so'm"
 */
export function numberToUzbekWords(num: number): string {
  if (num === 0) return "Nol so'm";
  
  const ones = ['', 'bir', 'ikki', 'uch', "to'rt", 'besh', 'olti', 'yetti', 'sakkiz', "to'qqiz"];
  const tens = ['', "o'n", 'yigirma', "o'ttiz", 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', "to'qson"];
  
  function convertGroup(n: number): string {
    let result = '';
    const hundreds = Math.floor(n / 100);
    const remainder = n % 100;
    const ten = Math.floor(remainder / 10);
    const one = remainder % 10;
    
    if (hundreds > 0) {
      if (hundreds === 1) {
        result += 'bir yuz ';
      } else {
        result += ones[hundreds] + ' yuz ';
      }
    }
    
    if (ten > 0) {
      result += tens[ten] + ' ';
    }
    
    if (one > 0) {
      result += ones[one] + ' ';
    }
    
    return result.trim();
  }

  const isNeg = num < 0;
  let abs = Math.abs(Math.round(num));
  
  if (abs >= 1000000000000) {
    return formatUzbekSom(num) + " so'm (juda katta summa)";
  }

  const scales = [
    { value: 1000000000, name: 'milliard' },
    { value: 1000000, name: 'million' },
    { value: 1000, name: 'ming' },
  ];

  let words = '';

  for (const scale of scales) {
    if (abs >= scale.value) {
      const count = Math.floor(abs / scale.value);
      words += convertGroup(count) + ' ' + scale.name + ' ';
      abs = abs % scale.value;
    }
  }

  if (abs > 0) {
    words += convertGroup(abs);
  }

  words = words.trim();
  if (!words) words = 'nol';

  const capitalized = words.charAt(0).toUpperCase() + words.slice(1);
  return (isNeg ? 'Minus ' : '') + capitalized + " so'm";
}

/**
 * Audio feedback using Web Audio API synthesis (no external assets required)
 */
class SoundEffects {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playClick() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio might be blocked by browser policy before gesture
    }
  }

  playCalculate() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  playClear() {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.12);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEffects();
