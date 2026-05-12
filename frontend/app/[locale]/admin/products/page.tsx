'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi, categoryApi } from '@/lib/api';
import { Product, Category } from '@/types';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin', 'products', page],
    queryFn: () => productApi.getProducts({ page, size: 20 }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: () => categoryApi.getAllCategories(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('상품이 삭제되었습니다.');
    },
    onError: () => toast.error('삭제에 실패했습니다.'),
  });

  const products: Product[] = productsData?.data?.data?.content || [];
  const categories: Category[] = categoriesData?.data?.data || [];
  const pageData = productsData?.data?.data;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
        >
          <Plus size={16} />
          새 상품 등록
        </button>
      </div>

      {/* 검색 */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="상품명 검색"
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* 상품 테이블 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">상품명</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">카테고리</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">가격</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">재고</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">상태</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  등록된 상품이 없습니다.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                    {product.brand && <div className="text-xs text-gray-400">{product.brand}</div>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.categoryName}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="font-medium">{product.price.toLocaleString()}원</div>
                    {product.discountPrice && (
                      <div className="text-xs text-red-500">{product.discountPrice.toLocaleString()}원</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.status === 'ACTIVE' ? '판매중' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setEditProduct(product); setShowForm(true); }}
                        className="text-gray-400 hover:text-indigo-600 transition"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('정말 삭제하시겠습니까?')) {
                            deleteMutation.mutate(product.id);
                          }
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {pageData && pageData.totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {Array.from({ length: pageData.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded text-sm ${
                  i === page ? 'bg-indigo-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 상품 등록/수정 모달 */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
          }}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  categories,
  onClose,
  onSuccess,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    discountPrice: product?.discountPrice?.toString() || '',
    stock: product?.stock?.toString() || '0',
    thumbnailUrl: product?.thumbnailUrl || '',
    categoryId: product?.categoryId?.toString() || '',
    brand: product?.brand || '',
    featured: product?.featured || false,
    status: product?.status || 'ACTIVE',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
        stock: parseInt(form.stock),
        categoryId: parseInt(form.categoryId),
      };
      if (product) {
        await productApi.updateProduct(product.id, payload);
        toast.success('상품이 수정되었습니다.');
      } else {
        await productApi.createProduct(payload);
        toast.success('상품이 등록되었습니다.');
      }
      onSuccess();
    } catch {
      toast.error('저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold">{product ? '상품 수정' : '새 상품 등록'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">상품명 *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격 *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">할인가</label>
              <input
                type="number"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">재고</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">선택하세요</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">브랜드</label>
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ACTIVE">판매중</option>
                <option value="INACTIVE">비활성</option>
                <option value="OUT_OF_STOCK">품절</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">썸네일 URL</label>
              <input
                value={form.thumbnailUrl}
                onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">상품 설명</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm text-gray-700">추천 상품으로 설정</label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
