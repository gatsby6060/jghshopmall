'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
import { useState, Suspense } from 'react';

function SearchContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'search', keyword, page],
    queryFn: () => productApi.searchProducts(keyword, { page, size: 20 }),
    enabled: !!keyword,
  });

  const pageData = data?.data?.data;
  const products: Product[] = pageData?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          &quot;{keyword}&quot; 검색 결과
        </h1>
        {pageData && (
          <p className="text-sm text-gray-500 mt-1">총 {pageData.totalElements}개 상품</p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-medium mb-2">검색 결과가 없습니다</p>
          <p className="text-sm">다른 검색어로 시도해보세요.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
          ))}
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
