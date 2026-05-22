'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productApi, cartApi } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(Number(id)),
  });

  const product = data?.data?.data;

  const handleAddToCart = async (): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      router.push(`/${locale}/login`);
      return false;
    }
    try {
      const res = await cartApi.addToCart({ productId: product.id, quantity });
      addItem(res.data.data);
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('장바구니에 추가되었습니다.');
      return true;
    } catch {
      toast.error('장바구니 추가에 실패했습니다.');
      return false;
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      router.push(`/${locale}/login`);
      return;
    }
    const success = await handleAddToCart();
    if (success) {
      router.push(`/${locale}/cart`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20">상품을 찾을 수 없습니다.</div>;

  const discountRate = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 상품 이미지 */}
        <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden">
          {product.thumbnailUrl ? (
            <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">🛍️</div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="space-y-5">
          {product.brand && (
            <p className="text-sm text-gray-500 font-medium">{product.brand}</p>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

          {/* 가격 */}
          <div className="flex items-baseline gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  {product.discountPrice.toLocaleString()}원
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {product.price.toLocaleString()}원
                </span>
                <span className="text-lg font-bold text-red-500">{discountRate}% 할인</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                {product.price.toLocaleString()}원
              </span>
            )}
          </div>

          {/* 배송 정보 */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">배송비</span>
              <span className="font-medium">
                {product.discountPrice && product.discountPrice >= 50000 || product.price >= 50000
                  ? '무료배송'
                  : '3,000원'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">재고</span>
              <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock}개 남음` : '품절'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">카테고리</span>
              <span className="font-medium">{product.categoryName}</span>
            </div>
          </div>

          {/* 수량 선택 */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">수량</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* 구매 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              장바구니 담기
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              바로 구매
            </button>
          </div>

          {/* 상품 설명 */}
          {product.description && (
            <div className="border-t pt-5">
              <h3 className="font-semibold text-gray-900 mb-3">상품 설명</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
