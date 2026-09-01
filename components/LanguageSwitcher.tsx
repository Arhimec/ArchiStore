'use client';

import { useLanguage } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬BH' },
    { code: 'ro', label: 'Română', flag: '🇷🇴' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="flex items-center bg-slate-200 border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-0.5 sm:p-1 text-[11px] font-mono">
      <Globe className="hidden sm:block w-3.5 h-3.5 text-slate-700 dark:text-zinc-300 ml-1.5 mr-1" />
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLanguage(opt.code)}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-all flex items-center gap-0.5 sm:gap-1 ${
            language === opt.code
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white'
          }`}
          title={opt.label}
        >
          <span className="text-[11px] sm:text-xs">{opt.flag.slice(0, 2)}</span>
          <span className="uppercase text-[10px] sm:text-xs">{opt.code}</span>
        </button>
      ))}
    </div>
  );
}
