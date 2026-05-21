'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { cartApi } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('header');
  const tCat = useTranslations('categories');
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { setItems } = useCartStore();
  const totalCount = useCartStore((state) => state.totalCount());
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      cartApi.getCartItems()
        .then((res) => {
          if (res?.data?.data) {
            setItems(res.data.data);
          }
        })
        .catch((err) => {
          console.error('Failed to sync cart items:', err);
        });
    } else {
      setItems([]);
    }
  }, [isAuthenticated, setItems]);

  const categories = [
    { id: 1, name: tCat('fashion'), slug: 'fashion' },
    { id: 2, name: tCat('electronics'), slug: 'electronics' },
    { id: 3, name: tCat('beauty'), slug: 'beauty' },
    { id: 4, name: tCat('food'), slug: 'food' },
    { id: 5, name: tCat('sports'), slug: 'sports' },
    { id: 6, name: tCat('furniture'), slug: 'furniture' },
    { id: 7, name: tCat('books'), slug: 'books' },
    { id: 8, name: tCat('kids'), slug: 'kids' },
    { id: 9, name: tCat('pets'), slug: 'pets' },
    { id: 10, name: tCat('auto'), slug: 'auto' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/search?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    clearAuth();
    router.push(`/${locale}`);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* 상단 바 */}
      <div className="bg-gray-900 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>{t('freeShipping')}</span>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300 mr-2">
                  <span className="text-indigo-400 font-semibold">{t('welcome', { name: user?.name || '' })}</span>
                </span>
                <Link href={`/${locale}/mypage`} className="hover:text-gray-300">
                  {t('mypage')}
                </Link>
                <button onClick={handleLogout} className="hover:text-gray-300">
                  {t('logout')}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/login`} className="hover:text-gray-300">
                  {t('login')}
                </Link>
                <Link href={`/${locale}/signup`} className="hover:text-gray-300">
                  {t('signup')}
                </Link>
              </>
            )}
            {user?.role === 'ADMIN' && (
              <Link href={`/${locale}/admin`} className="hover:text-yellow-300 font-semibold">
                {t('admin')}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-6">
          {/* 로고 */}
          <Link href={`/${locale}`} className="text-2xl font-bold text-indigo-600 shrink-0">
            ShopMall
          </Link>

          {/* 검색창 */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full border border-gray-300 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* 아이콘 영역 */}
          <div className="flex items-center gap-4">
            {/* 언어 선택기 */}
            <LanguageSwitcher />

            <Link
              href={`/${locale}/mypage`}
              className="flex flex-col items-center text-gray-600 hover:text-indigo-600"
            >
              <User size={22} />
              <span className="text-xs mt-0.5">{t('mypage')}</span>
            </Link>
            <Link
              href={`/${locale}/cart`}
              className="relative flex flex-col items-center text-gray-600 hover:text-indigo-600"
            >
              <ShoppingCart size={22} />
              {mounted && totalCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalCount > 9 ? '9+' : totalCount}
                </span>
              )}
              <span className="text-xs mt-0.5">{t('cart')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 카테고리 네비게이션 */}
      <nav className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto scrollbar-hide py-2">
            <Link
              href={`/${locale}`}
              className="text-sm font-semibold text-indigo-600 shrink-0 hover:text-indigo-800"
            >
              {t('home')}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/categories/${cat.id}`}
                className="text-sm text-gray-600 shrink-0 hover:text-indigo-600 whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
