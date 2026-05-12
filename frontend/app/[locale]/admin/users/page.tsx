'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/lib/api';
import { User } from '@/types';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: () => adminApi.getUsers({ page, size: 20 }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      adminApi.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('권한이 변경되었습니다.');
    },
    onError: () => toast.error('권한 변경에 실패했습니다.'),
  });

  const users: User[] = data?.data?.data?.content || [];
  const pageData = data?.data?.data;

  const providerLabels: Record<string, string> = {
    LOCAL: '이메일',
    GOOGLE: 'Google',
    NAVER: 'Naver',
    KAKAO: 'Kakao',
    APPLE: 'Apple',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">회원 관리</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">이름</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">이메일</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">가입 방법</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">권한</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">가입일</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">권한 변경</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  회원이 없습니다.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {providerLabels[user.provider] || user.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'ADMIN' ? '관리자' : '일반 회원'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {dayjs(user.createdAt).format('YYYY.MM.DD')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={user.role}
                      onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                      className="border border-gray-300 rounded text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="USER">일반 회원</option>
                      <option value="ADMIN">관리자</option>
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
