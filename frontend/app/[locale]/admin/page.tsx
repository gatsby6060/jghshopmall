'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Users, Package, ShoppingCart, TrendingUp, BarChart3, Award, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

interface DailySales {
  date: string;
  amount: number;
}

interface MonthlySales {
  month: string;
  amount: number;
}

interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  totalSales: number;
}

export default function AdminDashboardPage() {
  const locale = useLocale();

  // 1. 기본 대시보드 요약 정보 조회
  const { data: dashboardData, isLoading: isLoadingDashboard } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard(),
  });

  // 2. 매출 및 통계 데이터 조회
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin', 'salesStats'],
    queryFn: () => adminApi.getSalesStats(),
  });

  const dashboard = dashboardData?.data?.data;
  const salesStats = statsData?.data?.data;

  // 이번 달 매출 동적 계산 (monthlySales 의 마지막 항목이 통상 이번 달임)
  const currentMonthSales = salesStats?.monthlySales && salesStats.monthlySales.length > 0
    ? salesStats.monthlySales[salesStats.monthlySales.length - 1].amount
    : 0;

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
      color: 'bg-emerald-500',
      change: '+5%',
    },
    {
      title: '전체 주문',
      value: dashboard?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'bg-violet-500',
      change: '+23%',
    },
    {
      title: '이번 달 매출',
      value: isLoadingStats ? '계산 중...' : `₩${currentMonthSales.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-rose-500',
      change: '실시간 집계',
    },
  ];

  // 일별 차트 최대 매출액 계산 (비율 표기용)
  const maxDailySales = salesStats?.dailySales && salesStats.dailySales.length > 0
    ? Math.max(...salesStats.dailySales.map((d: DailySales) => d.amount))
    : 0;

  // 월별 차트 최대 매출액 계산 (비율 표기용)
  const maxMonthlySales = salesStats?.monthlySales && salesStats.monthlySales.length > 0
    ? Math.max(...salesStats.monthlySales.map((m: MonthlySales) => m.amount))
    : 0;

  // 인기 상품 최대 매출액 계산 (비율 표기용)
  const maxTopProductSales = salesStats?.topProducts && salesStats.topProducts.length > 0
    ? Math.max(...salesStats.topProducts.map((p: TopProduct) => p.totalSales))
    : 0;

  // 날짜 포맷팅 함수 (yyyy-MM-dd -> MM-dd 또는 MM월 dd일)
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[1]}/${parts[2]}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 상단 타이틀 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">대시보드</h1>
        <p className="text-sm text-gray-500">쇼핑몰의 실시간 현황과 매출 흐름을 모니터링합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} text-white p-3.5 rounded-xl shadow-inner group-hover:scale-110 transition duration-300`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs bg-gray-50 px-2.5 py-1 rounded-full text-gray-500 font-medium">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-gray-950 tracking-tight">
                {isLoadingDashboard || (stat.title === '이번 달 매출' && isLoadingStats) ? (
                  <span className="animate-pulse bg-gray-200 rounded w-28 h-8 block" />
                ) : (
                  typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value
                )}
              </p>
              <p className="text-sm font-medium text-gray-500 mt-1.5">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* 매출 시각화 대시보드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. 일별 매출 차트 (최근 7일) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Calendar size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">일별 매출 추이</h2>
              <p className="text-xs text-gray-400">최근 7일간의 일별 결제 완료 주문 기준</p>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between px-2 pb-2 h-full gap-3">
            {isLoadingStats ? (
              <div className="w-full flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : salesStats?.dailySales && salesStats.dailySales.length > 0 ? (
              salesStats.dailySales.map((item: DailySales) => {
                const heightPercent = maxDailySales > 0 ? (item.amount / maxDailySales) * 85 : 0; // 85% 최대치
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    
                    {/* Hover Tooltip 말풍선 */}
                    <div className="absolute bottom-[85%] mb-2 left-1/2 transform -translate-x-1/2 bg-gray-950/95 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-30 shadow-xl border border-gray-800 flex flex-col items-center">
                      <span className="text-[10px] text-gray-400 font-semibold">{item.date}</span>
                      <span className="font-bold text-indigo-300 mt-0.5">₩{item.amount.toLocaleString()}</span>
                      {/* Tooltip 화살표 */}
                      <div className="w-2 h-2 bg-gray-950/95 rotate-45 transform translate-y-1.5"></div>
                    </div>

                    {/* 막대 바 */}
                    <div 
                      style={{ height: `${Math.max(heightPercent, 2)}%` }}
                      className="w-full sm:w-8 bg-gradient-to-t from-indigo-600 via-indigo-500 to-purple-500 rounded-t-lg transition-all duration-500 ease-out hover:from-purple-600 hover:to-indigo-500 cursor-pointer shadow-sm shadow-indigo-100 group-hover:shadow-md"
                    />

                    {/* 날짜 축 */}
                    <span className="text-[11px] font-semibold text-gray-400 mt-3 group-hover:text-gray-900 transition-colors">
                      {formatDate(item.date)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex flex-col items-center justify-center text-gray-400 h-full">
                <BarChart3 size={40} className="mb-2 text-gray-300" />
                <span className="text-sm">최근 7일간 매출 데이터가 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. 월별 매출 차트 (최근 6달) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-[400px] overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">월별 매출 추이</h2>
              <p className="text-xs text-gray-400">최근 6개월간의 월별 누적 매출 현황</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between py-2 gap-3 min-h-0 overflow-y-auto">
            {isLoadingStats ? (
              <div className="w-full flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : salesStats?.monthlySales && salesStats.monthlySales.length > 0 ? (
              salesStats.monthlySales.map((item: MonthlySales) => {
                const widthPercent = maxMonthlySales > 0 ? (item.amount / maxMonthlySales) * 100 : 0;
                return (
                  <div key={item.month} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-600 tracking-tight">{item.month}</span>
                      <span className="text-gray-900 font-bold">₩{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative group cursor-pointer shadow-inner">
                      <div 
                        style={{ width: `${Math.max(widthPercent, 1.5)}%` }}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 ease-out hover:from-teal-500 hover:to-emerald-400 shadow-md"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="w-full flex flex-col items-center justify-center text-gray-400 h-full">
                <BarChart3 size={40} className="mb-2 text-gray-300" />
                <span className="text-sm">최근 6달간 매출 데이터가 없습니다.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 인기 상품 및 부가 대시보드 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 3. 인기 상품 통계 차트 (Top 5) */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Award size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">실시간 인기 상품 (Top 5)</h2>
              <p className="text-xs text-gray-400">결제 완료 기준 수량 및 매출이 가장 높은 베스트 상품</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoadingStats ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
              </div>
            ) : salesStats?.topProducts && salesStats.topProducts.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 text-center w-12">순위</th>
                    <th className="pb-3">상품명</th>
                    <th className="pb-3 text-center w-24">판매수량</th>
                    <th className="pb-3 text-right w-36">누적 매출액</th>
                    <th className="pb-3 pl-8 w-48">매출 비율</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {salesStats.topProducts.map((product: TopProduct, index: number) => {
                    const ratioPercent = maxTopProductSales > 0 ? (product.totalSales / maxTopProductSales) * 100 : 0;
                    const rankStyles = [
                      'bg-amber-100 text-amber-800 font-extrabold border border-amber-200 ring-2 ring-amber-50',
                      'bg-slate-100 text-slate-800 font-extrabold border border-slate-200 ring-2 ring-slate-50',
                      'bg-orange-100 text-orange-800 font-extrabold border border-orange-200 ring-2 ring-orange-50',
                      'bg-gray-100 text-gray-600 font-semibold',
                      'bg-gray-100 text-gray-600 font-semibold',
                    ];

                    return (
                      <tr key={product.productId} className="hover:bg-gray-50/50 transition group">
                        <td className="py-4 text-center">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${rankStyles[index] || 'bg-gray-100 text-gray-600'}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 font-semibold text-gray-800 group-hover:text-indigo-600 transition truncate max-w-[200px]" title={product.productName}>
                          {product.productName}
                        </td>
                        <td className="py-4 text-center font-bold text-gray-600">
                          {product.quantitySold.toLocaleString()}개
                        </td>
                        <td className="py-4 text-right font-black text-gray-900">
                          ₩{product.totalSales.toLocaleString()}
                        </td>
                        <td className="py-4 pl-8">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden shadow-inner max-w-[150px]">
                              <div 
                                style={{ width: `${ratioPercent}%` }}
                                className="bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 h-full rounded-full transition-all duration-700 ease-out"
                              />
                            </div>
                            <span className="text-xs text-gray-400 font-bold min-w-[32px] text-right">
                              {Math.round(ratioPercent)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                <Award size={40} className="mb-2 text-gray-300" />
                <span className="text-sm">현재 판매 집계된 인기 상품이 없습니다.</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. 빠른 작업 및 시스템 정보 */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-5">빠른 작업</h2>
            <div className="space-y-3">
              <Link href={`/${locale}/admin/products`} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-indigo-50/50 hover:text-indigo-600 text-gray-700 font-semibold border border-transparent hover:border-indigo-100 transition duration-200 group">
                <Package size={18} className="text-indigo-500 group-hover:scale-110 transition" />
                <span className="text-sm">새 상품 등록</span>
              </Link>
              <Link href={`/${locale}/admin/categories`} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-emerald-50/50 hover:text-emerald-600 text-gray-700 font-semibold border border-transparent hover:border-emerald-100 transition duration-200 group">
                <Package size={18} className="text-emerald-500 group-hover:scale-110 transition" />
                <span className="text-sm">카테고리 관리</span>
              </Link>
              <Link href={`/${locale}/admin/orders`} className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-violet-50/50 hover:text-violet-600 text-gray-700 font-semibold border border-transparent hover:border-violet-100 transition duration-200 group">
                <ShoppingCart size={18} className="text-violet-500 group-hover:scale-110 transition" />
                <span className="text-sm">주문 처리</span>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 mb-5">시스템 정보</h2>
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-500">API 서버</span>
                <span className="text-emerald-600 flex items-center gap-1.5 text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  ● 정상 작동
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                <span className="text-gray-500">데이터베이스</span>
                <span className="text-emerald-600 flex items-center gap-1.5 text-xs bg-emerald-50 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  ● 연결 성공
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">플랫폼 버전</span>
                <span className="text-gray-600 text-xs bg-gray-100 px-2.5 py-1 rounded-full">v1.0.0</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
