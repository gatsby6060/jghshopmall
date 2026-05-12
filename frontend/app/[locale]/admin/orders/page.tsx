'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const statusLabels: Record<OrderStatus, string> = {
  PENDING: '주문 대기',
  PAYMENT_DONE: '결제 완료',
  PREPARING: '상품 준비',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소',
  REFUNDED: '환불',
};

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_DONE: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', page],
    queryFn: () => adminApi.getOrders({ page, size: 20 }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('주문 상태가 변경되었습니다.');
    },
    onError: () => toast.error('상태 변경에 실패했습니다.'),
  });

  const orders: Order[] = data?.data?.data?.content || [];
  const pageData = data?.data?.data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">주문 관리</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">주문번호</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">수령인</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">결제금액</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">상태</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">주문일시</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">상태 변경</th>
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
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  주문이 없습니다.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-indigo-600">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{order.receiverName}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {order.finalAmount.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {dayjs(order.createdAt).format('YYYY.MM.DD HH:mm')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                      className="border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
    </div>
  );
}
