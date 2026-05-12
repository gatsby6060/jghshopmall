'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { cartApi } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  const discountRate = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      router.push('/login');
      return;
    }
    try {
      const res = await cartApi.addToCart({ productId: product.id, quantity: 1 });
      addItem(res.data.data);
      toast.success('장바구니에 추가되었습니다.');
    } catch {
      toast.error('장바구니 추가에 실패했습니다.');
    }
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        {/* 상품 이미지 */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnailUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-5xl bg-gray-100">🛍️</div>';
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
              🛍️
            </div>
          )}
          {discountRate > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              -{discountRate}%
            </span>
          )}
          {product.featured && (
            <span className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              추천
            </span>
          )}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 hover:text-white text-gray-600"
          >
            <ShoppingCart size={16} />
          </button>
        </div>

        {/* 상품 정보 */}
        <div className="p-3">
          {product.brand && (
            <p className="text-xs text-gray-400 mb-1 font-medium">{product.brand}</p>
          )}
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            {product.discountPrice ? (
              <>
                <span className="text-base font-bold text-gray-900">
                  {Number(product.discountPrice).toLocaleString()}원
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {Number(product.price).toLocaleString()}원
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900">
                {Number(product.price).toLocaleString()}원
              </span>
            )}
          </div>
          {product.salesCount > 0 && (
            <p className="text-xs text-gray-400 mt-1">{product.salesCount.toLocaleString()}개 판매</p>
          )}
        </div>
      </div>
    </Link>
  );
}
