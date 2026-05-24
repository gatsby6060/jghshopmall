'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderApi, paymentApi, cartApi } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import Script from 'next/script';

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          bname: string;
          buildingName: string;
          userSelectedType: 'R' | 'J';
          roadAddress: string;
          jibunAddress: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
    IMP?: {
      init: (storeCode: string) => void;
      request_pay: (
        params: Record<string, unknown>,
        callback: (rsp: {
          success: boolean;
          imp_uid: string;
          merchant_uid: string;
          paid_amount: number;
          error_msg?: string;
        }) => void
      ) => void;
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

const formatPhoneNumber = (value: string) => {
  if (!value) return value;
  const cleanNumber = value.replace(/[^\d]/g, '');
  
  if (cleanNumber.startsWith('02')) {
    if (cleanNumber.length <= 2) return cleanNumber;
    if (cleanNumber.length <= 5) return `${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2)}`;
    if (cleanNumber.length <= 9) return `${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2, 5)}-${cleanNumber.slice(5)}`;
    return `${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2, 6)}-${cleanNumber.slice(6, 10)}`;
  } else {
    if (cleanNumber.length <= 3) return cleanNumber;
    if (cleanNumber.length <= 6) return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3)}`;
    if (cleanNumber.length <= 10) return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`;
    return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 7)}-${cleanNumber.slice(7, 11)}`;
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      receiverName: user?.name || '',
      receiverPhone: user?.phone || '',
    },
  });

  const handleAddressSearch = () => {
    if (typeof window !== 'undefined' && window.daum) {
      new window.daum.Postcode({
        oncomplete: (data) => {
          let fullAddress = data.address;
          let extraAddress = '';

          if (data.userSelectedType === 'R') {
            if (data.bname !== '') {
              extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
              extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
          }

          setValue('zipCode', data.zonecode, { shouldValidate: true });
          setValue('address', fullAddress, { shouldValidate: true });
          
          // 주소 입력 완료 후 상세 주소 필드로 포커스 이동
          const addressDetailInput = document.getElementsByName('addressDetail')[0] as HTMLInputElement;
          if (addressDetailInput) {
            addressDetailInput.focus();
          }
        },
      }).open();
    } else {
      toast.error('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

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

      // 2. 포트원 결제 요청
      if (typeof window !== 'undefined' && window.IMP) {
        const { IMP } = window;
        const storeCode = process.env.NEXT_PUBLIC_PORTONE_STORE_CODE || 'imp19421636';
        IMP.init(storeCode);

        const orderName = items.length === 1 
          ? items[0].productName 
          : `${items[0].productName} 외 ${items.length - 1}건`;

        IMP.request_pay({
          pg: 'html5_inicis',
          pay_method: 'card',
          merchant_uid: order.orderNumber,
          name: orderName,
          amount: finalAmount,
          buyer_email: user?.email || '',
          buyer_name: user?.name || formData.receiverName,
          buyer_tel: user?.phone || formData.receiverPhone,
          buyer_addr: `${formData.address} ${formData.addressDetail || ''}`,
          buyer_postcode: formData.zipCode,
          m_redirect_url: `${window.location.origin}/orders/${order.id}?success=true`,
        }, async (rsp) => {
          if (rsp.success) {
            try {
              setIsLoading(true);
              // 3. 결제 검증 및 승인
              await paymentApi.confirmPayment({
                paymentKey: rsp.imp_uid,
                orderId: rsp.merchant_uid,
                amount: rsp.paid_amount,
              });

              try {
                await cartApi.clearCart();
              } catch (err) {
                console.error('Failed to clear cart on server:', err);
              }
              clearCart();
              queryClient.invalidateQueries({ queryKey: ['cart'] });
              toast.success('결제가 완료되었습니다!');
              router.push(`/${locale}/orders/${order.id}`);
            } catch (err: unknown) {
              const error = err as { message?: string };
              toast.error(error.message || '결제 검증에 실패했습니다.');
            } finally {
              setIsLoading(false);
            }
          } else {
            toast.error(rsp.error_msg || '결제에 실패했습니다.');
            setIsLoading(false);
          }
        });
      } else {
        // 포트원 SDK 미로드 시 모의 결제
        toast.success('주문이 완료되었습니다! (테스트 모드)');
        try {
          await cartApi.clearCart();
        } catch (err) {
          console.error('Failed to clear cart on server:', err);
        }
        clearCart();
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        router.push(`/${locale}/orders/${order.id}`);
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
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      setValue('receiverPhone', formatted, { shouldValidate: true });
                    }}
                    maxLength={13}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  {errors.receiverPhone && (
                    <p className="text-red-500 text-xs mt-1">{errors.receiverPhone.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">우편번호 *</label>
                  <div className="flex gap-2">
                    <input
                      {...register('zipCode')}
                      placeholder="우편번호"
                      readOnly
                      onClick={handleAddressSearch}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-pointer focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition font-medium"
                    >
                      우편번호 찾기
                    </button>
                  </div>
                  {errors.zipCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                  <input
                    {...register('address')}
                    readOnly
                    onClick={handleAddressSearch}
                    placeholder="우편번호 찾기를 통해 주소를 입력해주세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-pointer focus:outline-none"
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
      <Script 
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" 
        strategy="lazyOnload" 
      />
    </div>
  );
}
