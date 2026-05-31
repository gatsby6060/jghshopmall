'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { cartApi, searchApi } from '@/lib/api';

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
  const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  interface SuggestedCategory {
    id: number;
    name: string;
    fullPath: string;
  }
  const [suggestedCategories, setSuggestedCategories] = useState<SuggestedCategory[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    searchApi.getPopularKeywords()
      .then((res) => {
        if (res?.data?.data) {
          setPopularKeywords(res.data.data);
        }
      })
      .catch((err) => console.error('Failed to fetch popular keywords:', err));
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSuggestedCategories([]);
      return;
    }
    const delayDebounce = setTimeout(() => {
      searchApi.getAutocompleteSuggestions(searchQuery)
        .then((res) => {
          if (res?.data?.data) {
            setSuggestions(res.data.data.suggestions || []);
            setSuggestedCategories(res.data.data.categories || []);
          }
        })
        .catch((err) => console.error('Failed to fetch suggestions:', err));
    }, 200);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

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

  const highlightMatch = (text: string, query: string) => {
    if (!query) return <span>{text}</span>;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-indigo-600 font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
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
                onFocus={() => setShowDropdown(true)}
                onBlur={() => {
                  setTimeout(() => setShowDropdown(false), 200);
                }}
                placeholder={t('searchPlaceholder')}
                className="w-full border border-gray-300 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
              >
                <Search size={20} />
              </button>

              {/* Autocomplete / Popular Search Dropdown */}
              {showDropdown && (
                <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out p-4">
                  {/* Suggestions List */}
                  {searchQuery.trim() && (suggestions.length > 0 || suggestedCategories.length > 0) && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        추천 검색어 및 카테고리
                      </h4>
                      <ul className="space-y-1">
                        {/* 1. Exact query item containing categories nested below it */}
                        <li>
                          <button
                            type="button"
                            onClick={() => {
                              router.push(`/${locale}/search?keyword=${encodeURIComponent(searchQuery)}`);
                              setShowDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-indigo-50/50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2 font-semibold"
                          >
                            <Search size={14} className="text-indigo-500 shrink-0" />
                            <span>{highlightMatch(searchQuery, searchQuery)}</span>
                          </button>

                          {/* Matching Categories nested below exact query */}
                          {suggestedCategories.length > 0 && (
                            <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/50 rounded-lg mt-1 border border-gray-100/50">
                              {suggestedCategories.map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    router.push(`/${locale}/categories/${cat.id}`);
                                    setShowDropdown(false);
                                  }}
                                  className="w-full text-left pl-3 pr-3 py-1.5 text-xs text-gray-500 hover:bg-indigo-50/70 hover:text-indigo-600 rounded-md transition flex items-center gap-1.5"
                                >
                                  <span className="text-indigo-400 font-medium">↳</span>
                                  <span className="truncate">{highlightMatch(cat.fullPath, searchQuery)}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </li>

                        {/* Subtle divider if we have other autocomplete keyword suggestions */}
                        {suggestions.filter((s) => s.toLowerCase() !== searchQuery.toLowerCase()).length > 0 && (
                          <div className="border-t border-gray-100/80 my-2 px-2" />
                        )}

                        {/* 2. Other autocomplete suggestion keywords containing the search query */}
                        {suggestions
                          .filter((s) => s.toLowerCase() !== searchQuery.toLowerCase())
                          .map((suggestion, index) => (
                            <li key={index}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchQuery(suggestion);
                                  router.push(`/${locale}/search?keyword=${encodeURIComponent(suggestion)}`);
                                  setShowDropdown(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2"
                              >
                                <Search size={14} className="text-gray-400 shrink-0" />
                                <span>{highlightMatch(suggestion, searchQuery)}</span>
                              </button>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {/* Popular Keywords List */}
                  {popularKeywords.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        실시간 인기 검색어
                      </h4>
                      <div className="grid grid-cols-2 gap-2 p-1">
                        {popularKeywords.map((kw, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setSearchQuery(kw);
                              router.push(`/${locale}/search?keyword=${encodeURIComponent(kw)}`);
                              setShowDropdown(false);
                            }}
                            className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-rose-50/50 hover:text-rose-600 rounded-lg transition flex items-center gap-2"
                          >
                            <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${index < 3 ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                              {index + 1}
                            </span>
                            <span className="truncate">{kw}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {!searchQuery.trim() && popularKeywords.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-xs">
                      인기 검색어가 준비 중입니다.
                    </div>
                  )}
                </div>
              )}
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
