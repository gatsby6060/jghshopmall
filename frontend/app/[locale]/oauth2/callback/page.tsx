'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

function OAuth2CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
      try {
        const decoded = jwtDecode<JwtPayload>(accessToken);
        setAuth(
          {
            id: Number(decoded.sub),
            email: decoded.email,
            name: '',
            role: decoded.role as 'USER' | 'ADMIN',
            provider: 'GOOGLE',
            createdAt: '',
          },
          accessToken,
          refreshToken
        );
        toast.success('소셜 로그인이 완료되었습니다.');
        router.push('/');
      } catch {
        toast.error('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
      }
    } else {
      toast.error('로그인에 실패했습니다.');
      router.push('/login');
    }
  }, [searchParams, setAuth, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    }>
      <OAuth2CallbackContent />
    </Suspense>
  );
}
