'use client';

import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Package, User, MapPin, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import { Order, OrderStatus } from '@/types';
import { useTranslations, useLocale } from 'next-intl';

export default function MyPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('mypage');
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.push(`/${locale}/login`);
  }, [isAuthenticated, router, locale]);

  const { data } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => orderApi.getMyOrders({ page: 0, size: 5 }),
    enabled: isAuthenticated,
  });

  const orders: Order[] = data?.data?.data?.content || [];

  if (!isAuthenticated || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 프로필 카드 */}
        <div className="md:col-span-1 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={36} className="text-indigo-600" />
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="mt-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                {t('admin')}
              </span>
            )}
          </div>
        </div>

        {/* 빠른 메뉴 */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            {
              icon: Package,
              label: t('quickMenu.orderHistory'),
              href: `/${locale}/orders`,
              color: 'text-indigo-600 bg-indigo-50',
            },
            {
              icon: MapPin,
              label: t('quickMenu.addressManage'),
              href: `/${locale}/mypage/addresses`,
              color: 'text-green-600 bg-green-50',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition"
              >
                <div className={`${item.color} p-3 rounded-lg`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t('viewAll')}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 ml-auto" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* 최근 주문 내역 */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{t('recentOrders')}</h2>
          <Link href={`/${locale}/orders`} className="text-sm text-indigo-600 hover:underline">
            {t('viewAll')}
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package size={40} className="mx-auto mb-3 text-gray-300" />
            <p>{t('noOrders')}</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/${locale}/orders/${order.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {dayjs(order.createdAt).format('YYYY.MM.DD')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {order.finalAmount.toLocaleString()}원
                  </p>
                  <span className="text-xs text-indigo-600">
                    {t(`orderStatus.${order.status as OrderStatus}`)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
