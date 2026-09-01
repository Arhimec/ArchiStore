'use client';

import { useLanguage } from '@/lib/i18n/context';
import { Language } from '@/lib/i18n/translations';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const options: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ro', label: 'Română', flag: '🇷🇴' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
  ];

  return (
    <div className="flex items-center bg-slate-200 border border-slate-300 dark:bg-zinc-800 dark:border-zinc-700 rounded-lg p-1 text-xs font-mono">
      <Globe className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300 ml-1.5 mr-1" />
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLanguage(opt.code)}
          className={`px-2 py-1 rounded transition-all flex items-center gap-1 ${
            language === opt.code
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white'
          }`}
          title={opt.label}
        >
          <span>{opt.flag}</span>
          <span className="uppercase">{opt.code}</span>
        </button>
      ))}
    </div>
  );
}
