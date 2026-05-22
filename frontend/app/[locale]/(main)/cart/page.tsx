'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { cartApi } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';

export default function CartPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('cart');
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { items, setItems, updateItem, removeItem, totalPrice } = useCartStore();

  const { data } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCartItems(),
    enabled: isAuthenticated,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    if (data?.data?.data) {
      setItems(data.data.data);
    }
  }, [data, setItems]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-4">{t('loginRequired')}</h2>
        <Link
          href={`/${locale}/login`}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          {t('doLogin')}
        </Link>
      </div>
    );
  }

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      await cartApi.updateQuantity(id, quantity);
      updateItem(id, quantity);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch {
      toast.error(t('quantityError'));
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await cartApi.removeFromCart(id);
      removeItem(id);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success(t('removeSuccess'));
    } catch {
      toast.error(t('removeError'));
    }
  };

  const shippingFee = totalPrice() >= 50000 ? 0 : 3000;
  const finalAmount = totalPrice() + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('empty')}</h2>
        <p className="text-gray-500 mb-6">{t('emptyDesc')}</p>
        <Link
          href={`/${locale}`}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
        >
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 장바구니 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
              <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {item.productThumbnail ? (
                  <Image src={item.productThumbnail} alt={item.productName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 line-clamp-2">{item.productName}</h3>
                <p className="text-indigo-600 font-bold mt-1">
                  {(item.discountPrice ?? item.price).toLocaleString()}원
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-2 py-1 hover:bg-gray-100 text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                      className="px-2 py-1 hover:bg-gray-100 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-gray-900">
                  {((item.discountPrice ?? item.price) * item.quantity).toLocaleString()}원
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('orderSummary')}</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('productAmount')}</span>
                <span>{totalPrice().toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('shippingFee')}</span>
                <span>{shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원`}</span>
              </div>
              {shippingFee > 0 && (
                <p className="text-xs text-gray-400">
                  {t('freeShippingRemaining', { amount: (50000 - totalPrice()).toLocaleString() })}
                </p>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-base">
                <span>{t('totalAmount')}</span>
                <span className="text-indigo-600">{finalAmount.toLocaleString()}원</span>
              </div>
            </div>
            <button
              onClick={() => router.push(`/${locale}/checkout`)}
              className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition"
            >
              {t('order')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
