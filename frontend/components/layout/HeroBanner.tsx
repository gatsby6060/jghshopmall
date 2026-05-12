'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

const BANNER_KEYS = [
  {
    key: 'spring',
    bgColor: 'from-indigo-600 to-purple-600',
    link: '/categories/1',
    badge: 'NEW',
  },
  {
    key: 'electronics',
    bgColor: 'from-blue-600 to-cyan-600',
    link: '/categories/2',
    badge: 'SALE',
  },
  {
    key: 'beauty',
    bgColor: 'from-pink-500 to-rose-500',
    link: '/categories/3',
    badge: 'HOT',
  },
] as const;

export default function HeroBanner() {
  const t = useTranslations('banner');
  const locale = useLocale();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNER_KEYS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + BANNER_KEYS.length) % BANNER_KEYS.length);
  const next = () => setCurrent((c) => (c + 1) % BANNER_KEYS.length);

  const bannerMeta = BANNER_KEYS[current];

  return (
    <div className={`relative bg-gradient-to-r ${bannerMeta.bgColor} text-white overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="max-w-xl">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            {bannerMeta.badge}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {t(`slides.${bannerMeta.key}.title`)}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2">
            {t(`slides.${bannerMeta.key}.subtitle`)}
          </p>
          <p className="text-lg opacity-80 mb-8">
            {t(`slides.${bannerMeta.key}.description`)}
          </p>
          <div className="flex gap-4">
            <Link
              href={`/${locale}${bannerMeta.link}`}
              className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition"
            >
              {t('shopNow')}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              {t('viewAll')}
            </Link>
          </div>
        </div>
      </div>

      {/* 네비게이션 버튼 */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition"
      >
        <ChevronRight size={24} />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {BANNER_KEYS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white w-6' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}
