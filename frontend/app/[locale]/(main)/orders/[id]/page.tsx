'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/api';
import { useLocale } from 'next-intl';
import { CheckCircle, CreditCard, Truck, Calendar, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Order, OrderStatus } from '@/types';

const statusMap: Record<OrderStatus, { text: string; color: string; bg: string }> = {
  PENDING: { text: '결제 대기', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  PAYMENT_DONE: { text: '결제 완료', color: 'text-green-600', bg: 'bg-green-50' },
  PREPARING: { text: '배송 준비 중', color: 'text-blue-600', bg: 'bg-blue-50' },
  SHIPPED: { text: '배송 중', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  DELIVERED: { text: '배송 완료', color: 'text-gray-600', bg: 'bg-gray-50' },
  CANCELLED: { text: '주문 취소', color: 'text-red-600', bg: 'bg-red-50' },
  REFUNDED: { text: '환불 완료', color: 'text-purple-600', bg: 'bg-purple-50' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const orderId = params.id ? Number(params.id) : null;
  const isSuccess = searchParams.get('success') === 'true';

  const { data, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderApi.getOrder(orderId!),
    enabled: !!orderId,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-32 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="text-gray-500 mt-4 text-sm">주문 정보를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !data?.data?.data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">주문 내역을 찾을 수 없습니다</h2>
        <p className="text-gray-500 mb-8">주문 정보가 올바르지 않거나 이미 만료되었을 수 있습니다.</p>
        <button
          onClick={() => router.push(`/${locale}/mypage`)}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
        >
          마이페이지로 가기
        </button>
      </div>
    );
  }

  const order: Order = data.data.data;
  const statusInfo = statusMap[order.status] || { text: order.status, color: 'text-gray-600', bg: 'bg-gray-50' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 주문 완료 축하 헤더 (success=true 일 때 노출) */}
      {isSuccess && (
        <div className="mb-10 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100/50 shadow-sm animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
            <CheckCircle size={36} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">주문이 성공적으로 완료되었습니다!</h1>
          <p className="text-gray-500 text-sm mb-1">안전하고 신속하게 배송해 드리겠습니다.</p>
          <p className="text-xs text-indigo-600 font-medium">주문번호: {order.orderNumber}</p>
        </div>
      )}

      {/* 헤더 및 마이페이지 바로가기 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">주문 상세 내역</h2>
          <p className="text-gray-500 text-xs mt-1">
            주문일시: {new Date(order.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
        <Link
          href={`/${locale}/mypage`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition"
        >
          <ArrowLeft size={16} />
          주문 내역 전체 보기
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 주문 상품 & 배송 정보 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 상품 목록 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag size={20} className="text-indigo-600" />
              주문 상품 정보 ({order.items.length}개)
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    {item.productThumbnail ? (
                      <Image
                        src={item.productThumbnail}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🛍️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{item.productName}</h4>
                    <p className="text-gray-400 text-xs mt-1">
                      수량: {item.quantity}개
                    </p>
                    <p className="text-indigo-600 font-bold text-sm mt-1">
                      {item.unitPrice.toLocaleString()}원
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900 text-sm">
                      {item.totalPrice.toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 배송 정보 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={20} className="text-indigo-600" />
              배송지 정보
            </h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="py-3 text-gray-400 font-medium w-28">수령인</td>
                  <td className="py-3 text-gray-900 font-semibold">{order.receiverName}</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 text-gray-400 font-medium">연락처</td>
                  <td className="py-3 text-gray-900">{order.receiverPhone}</td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-3 text-gray-400 font-medium">배송지 주소</td>
                  <td className="py-3 text-gray-900">
                    <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded font-mono mb-1 mr-2">
                      {order.zipCode}
                    </span>
                    <p className="inline">{order.address}</p>
                    {order.addressDetail && <p className="text-gray-500 mt-1">{order.addressDetail}</p>}
                  </td>
                </tr>
                {order.orderMemo && (
                  <tr>
                    <td className="py-3 text-gray-400 font-medium">배송 요청사항</td>
                    <td className="py-3 text-gray-500 italic">{order.orderMemo}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 주문 요약 / 상태 */}
        <div className="lg:col-span-1 space-y-6">
          {/* 주문 상태 카드 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-600" />
              주문 상태
            </h3>
            <div className={`w-full py-3 rounded-xl ${statusInfo.bg} ${statusInfo.color} font-bold text-center text-sm`}>
              {statusInfo.text}
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              주문 번호: {order.orderNumber}
            </p>
          </div>

          {/* 결제 정보 카드 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-indigo-600" />
              결제 금액 상세
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">주문 상품 금액</span>
                <span className="text-gray-900 font-medium">{order.totalAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">할인 금액</span>
                <span className="text-red-500 font-medium">-{order.discountAmount.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">배송비</span>
                <span className="text-gray-900 font-medium">
                  {order.shippingFee === 0 ? '무료' : `+${order.shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>최종 결제 금액</span>
                <span className="text-indigo-600 text-lg">{order.finalAmount.toLocaleString()}원</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 text-xs text-gray-400 space-y-1">
              <p>• 결제 수단: 신용카드 (포트원 KG이니시스)</p>
              <p>• KG이니시스 테스트 결제건은 당일 밤 11시 50분경 자동으로 결제가 안전하게 취소됩니다.</p>
            </div>
          </div>

          {/* 메인 및 쇼핑 계속하기 버튼 */}
          <div className="space-y-3 pt-2">
            <Link
              href={`/${locale}`}
              className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition text-sm"
            >
              쇼핑 계속하기
            </Link>
            <Link
              href={`/${locale}/mypage`}
              className="w-full flex items-center justify-center bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition text-sm"
            >
              주문 내역서 확인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
