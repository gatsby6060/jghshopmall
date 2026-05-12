'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import Link from 'next/link';

export default function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.getFeaturedProducts(),
  });

  const products: Product[] = data?.data?.data || [];

  if (isLoading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">추천 상품</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">추천 상품</h2>
        <Link href="/categories/1" className="text-sm text-indigo-600 hover:underline">
          더보기 →
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
