'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { routing } from '@/i18n/routing';

const LOCALE_LABELS: Record<string, { label: string; flag: string }> = {
  ko: { label: '한국어', flag: '🇰🇷' },
  en: { label: 'English', flag: '🇺🇸' },
  ja: { label: '日本語', flag: '🇯🇵' },
  fr: { label: 'Français', flag: '🇫🇷' },
};

export default function LanguageSwitcher() {
  const t = useTranslations('header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: string) => {
    setIsOpen(false);
    // Replace the locale segment in the current pathname
    const currentLocale = locale;
    let newPath = pathname;

    if (pathname.startsWith(`/${currentLocale}`)) {
      newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    } else {
      newPath = `/${newLocale}${pathname}`;
    }

    router.push(newPath);
    router.refresh();
  };

  const current = LOCALE_LABELS[locale] || LOCALE_LABELS['ko'];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-gray-600 hover:text-indigo-600 transition-colors text-sm"
        aria-label={t('language')}
      >
        <Globe size={18} />
        <span className="hidden sm:inline font-medium">{current.flag} {locale.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fadeIn">
          <div className="py-1">
            {routing.locales.map((loc) => {
              const info = LOCALE_LABELS[loc];
              const isActive = loc === locale;
              return (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base">{info.flag}</span>
                  <span>{info.label}</span>
                  {isActive && (
                    <svg className="w-4 h-4 ml-auto text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
