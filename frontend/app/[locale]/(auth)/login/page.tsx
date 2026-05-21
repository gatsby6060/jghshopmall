'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      const { accessToken, refreshToken, userId, email, name, role } = res.data.data;
      setAuth(
        { id: userId, email, name, role: role as 'USER' | 'ADMIN', provider: 'LOCAL', createdAt: '' },
        accessToken,
        refreshToken
      );
      toast.success('로그인되었습니다.');
      router.push('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Next.js rewrites 프록시를 통해 백엔드로 전달되도록 상대 경로 사용
    window.location.href = `/oauth2/authorization/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-indigo-600">ShopMall</Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
              회원가입
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                {...register('email')}
                type="email"
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                {...register('password')}
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">소셜 계정으로 로그인</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {/* 구글 */}
              <button
                onClick={() => handleSocialLogin('google')}
                className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>

              {/* 카카오 */}
              <button
                onClick={() => handleSocialLogin('kakao')}
                className="flex items-center justify-center gap-2 bg-[#FEE500] rounded-lg py-2.5 text-sm font-medium text-[#3C1E1E] hover:bg-[#F0D900] transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.73 1.68 5.13 4.2 6.6L5.4 21l4.56-2.4c.66.12 1.35.18 2.04.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
                </svg>
                카카오
              </button>

              {/* 네이버 */}
              <button
                onClick={() => handleSocialLogin('naver')}
                className="flex items-center justify-center gap-2 bg-[#03C75A] rounded-lg py-2.5 text-sm font-medium text-white hover:bg-[#02B350] transition"
              >
                <span className="font-bold text-base">N</span>
                네이버
              </button>

              {/* 애플 */}
              <button
                onClick={() => handleSocialLogin('apple')}
                className="flex items-center justify-center gap-2 bg-black rounded-lg py-2.5 text-sm font-medium text-white hover:bg-gray-900 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
