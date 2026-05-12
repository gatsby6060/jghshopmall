'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  const dashboard = data?.data?.data;

  const stats = [
    {
      title: '전체 회원',
      value: dashboard?.totalUsers ?? 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: '전체 상품',
      value: dashboard?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-green-500',
      change: '+5%',
    },
    {
      title: '전체 주문',
      value: dashboard?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+23%',
    },
    {
      title: '이번 달 매출',
      value: '₩0',
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+8%',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">대시보드</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? (
                  <span className="animate-pulse bg-gray-200 rounded w-16 h-8 block" />
                ) : (
                  typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value
                )}
              </p>
              <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h2>
          <div className="space-y-3">
            <Link href="/admin/products" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <Package size={18} className="text-indigo-600" />
              <span className="text-sm font-medium">새 상품 등록</span>
            </Link>
            <Link href="/admin/categories" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <Package size={18} className="text-green-600" />
              <span className="text-sm font-medium">카테고리 관리</span>
            </Link>
            <Link href="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
              <ShoppingCart size={18} className="text-purple-600" />
              <span className="text-sm font-medium">주문 처리</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">시스템 정보</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">API 서버</span>
              <span className="text-green-600 font-medium">● 정상</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">데이터베이스</span>
              <span className="text-green-600 font-medium">● 정상</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">버전</span>
              <span className="font-medium">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
