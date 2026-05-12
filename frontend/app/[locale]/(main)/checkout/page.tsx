'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderApi, paymentApi } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    TossPayments: (clientKey: string) => {
      requestPayment: (method: string, options: Record<string, unknown>) => Promise<{
        paymentKey: string;
        orderId: string;
        amount: number;
      }>;
    };
  }
}

const checkoutSchema = z.object({
  receiverName: z.string().min(1, '수령인 이름을 입력해주세요'),
  receiverPhone: z.string().min(10, '올바른 전화번호를 입력해주세요'),
  zipCode: z.string().min(5, '우편번호를 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  orderMemo: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      receiverName: user?.name || '',
      receiverPhone: user?.phone || '',
    },
  });

  const shippingFee = totalPrice() >= 50000 ? 0 : 3000;
  const finalAmount = totalPrice() + shippingFee;

  const onSubmit = async (formData: CheckoutForm) => {
    if (items.length === 0) {
      toast.error('장바구니가 비어있습니다.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. 주문 생성
      const orderRes = await orderApi.createOrder({
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        ...formData,
      });
      const order = orderRes.data.data;

      // 2. 토스페이먼츠 결제 요청
      if (typeof window !== 'undefined' && window.TossPayments) {
        const tossPayments = window.TossPayments(
          process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_dummy'
        );

        const paymentResult = await tossPayments.requestPayment('카드', {
          amount: finalAmount,
          orderId: order.orderNumber,
          orderName: items.length === 1 ? items[0].productName : `${items[0].productName} 외 ${items.length - 1}건`,
          customerName: user?.name,
          customerEmail: user?.email,
          successUrl: `${window.location.origin}/orders/${order.id}?success=true`,
          failUrl: `${window.location.origin}/checkout?fail=true`,
        });

        // 3. 결제 승인
        await paymentApi.confirmPayment({
          paymentKey: paymentResult.paymentKey,
          orderId: paymentResult.orderId,
          amount: paymentResult.amount,
        });

        clearCart();
        toast.success('결제가 완료되었습니다!');
        router.push(`/orders/${order.id}`);
      } else {
        // 토스 SDK 미로드 시 모의 결제
        toast.success('주문이 완료되었습니다! (테스트 모드)');
        clearCart();
        router.push(`/orders/${order.id}`);
      }
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || '결제에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">주문/결제</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 배송지 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">배송지 정보</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">수령인 이름 *</label>
                  <input
                    {...register('receiverName')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.receiverName && (
                    <p className="text-red-500 text-xs mt-1">{errors.receiverName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                  <input
                    {...register('receiverPhone')}
                    placeholder="010-1234-5678"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.receiverPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.receiverPhone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">우편번호 *</label>
                  <input
                    {...register('zipCode')}
                    placeholder="12345"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                  <input
                    {...register('address')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">상세 주소</label>
                  <input
                    {...register('addressDetail')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">배송 메모</label>
                  <textarea
                    {...register('orderMemo')}
                    rows={2}
                    placeholder="배송 시 요청사항을 입력해주세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600 truncate flex-1 mr-2">{item.productName}</span>
                    <span className="shrink-0">
                      {((item.discountPrice ?? item.price) * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">상품 금액</span>
                  <span>{totalPrice().toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배송비</span>
                  <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>총 결제 금액</span>
                  <span className="text-indigo-600">{finalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {isLoading ? '처리 중...' : `${finalAmount.toLocaleString()}원 결제하기`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
