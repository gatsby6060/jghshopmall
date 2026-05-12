'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productApi, categoryApi } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { useState } from 'react';
import { Product } from '@/types';

const sortOptions = [
  { value: 'createdAt,desc', label: '최신순' },
  { value: 'salesCount,desc', label: '판매순' },
  { value: 'price,asc', label: '낮은 가격순' },
  { value: 'price,desc', label: '높은 가격순' },
];

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('createdAt,desc');

  const { data: categoryData } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryApi.getCategory(Number(id)),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'category', id, page, sort],
    queryFn: () => productApi.getProductsByCategory(Number(id), { page, size: 20 }),
  });

  const category = categoryData?.data?.data;
  const pageData = data?.data?.data;
  const products: Product[] = pageData?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {category?.name || '카테고리'}
          </h1>
          {pageData && (
            <p className="text-sm text-gray-500 mt-1">총 {pageData.totalElements}개 상품</p>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🛍️</p>
          <p>해당 카테고리에 상품이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* 페이지네이션 */}
          {pageData && pageData.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pageData.totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                    i === page
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
