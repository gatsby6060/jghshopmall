'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  LogOut,
  Home,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/products', label: '상품 관리', icon: Package },
  { href: '/admin/categories', label: '카테고리 관리', icon: Tag },
  { href: '/admin/orders', label: '주문 관리', icon: ShoppingCart },
  { href: '/admin/users', label: '회원 관리', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <Link href="/" className="text-xl font-bold text-indigo-400">ShopMall</Link>
          <p className="text-xs text-gray-400 mt-1">관리자 패널</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <Home size={18} />
            쇼핑몰로 이동
          </Link>
          <button
            onClick={() => { clearAuth(); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
