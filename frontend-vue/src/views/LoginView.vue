<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '../lib/api'
import { useAuthStore } from '../store/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const formData = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const validate = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!formData.email) {
    errors.email = '이메일을 입력해주세요'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '올바른 이메일을 입력해주세요'
    isValid = false
  }

  if (!formData.password) {
    errors.password = '비밀번호를 입력해주세요'
    isValid = false
  }

  return isValid
}

const onSubmit = async () => {
  if (!validate()) return

  isLoading.value = true
  try {
    const res = await authApi.login({
      email: formData.email,
      password: formData.password
    })
    
    const { accessToken, refreshToken, userId, email, name, role } = res.data.data
    
    authStore.setAuth(
      { id: userId, email, name, role, provider: 'LOCAL', createdAt: '' },
      accessToken,
      refreshToken
    )
    
    alert('로그인되었습니다.')
    router.push('/')
  } catch (error: any) {
    const message = error.response?.data?.message || '로그인에 실패했습니다.'
    alert(message)
  } finally {
    isLoading.value = false
  }
}

const handleSocialLogin = (provider: string) => {
  window.location.href = `/oauth2/authorization/${provider}`
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold text-indigo-600">ShopMall</router-link>
        <h2 class="mt-4 text-2xl font-bold text-gray-900">로그인</h2>
        <p class="mt-2 text-sm text-gray-600">
          계정이 없으신가요?
          <router-link to="/signup" class="text-indigo-600 hover:underline font-medium">
            회원가입
          </router-link>
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-8">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="example@email.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            {{ isLoading ? '로그인 중...' : '로그인' }}
          </button>
        </form>

        <!-- 소셜 로그인 -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-gray-500">소셜 계정으로 로그인</span>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <!-- 구글 -->
            <button
              @click="handleSocialLogin('google')"
              class="flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <!-- 카카오 -->
            <button
              @click="handleSocialLogin('kakao')"
              class="flex items-center justify-center gap-2 bg-[#FEE500] rounded-lg py-2.5 text-sm font-medium text-[#3C1E1E] hover:bg-[#F0D900] transition cursor-pointer"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.73 1.68 5.13 4.2 6.6L5.4 21l4.56-2.4c.66.12 1.35.18 2.04.18 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
              </svg>
              카카오
            </button>

            <!-- 네이버 -->
            <button
              @click="handleSocialLogin('naver')"
              class="flex items-center justify-center gap-2 bg-[#03C75A] rounded-lg py-2.5 text-sm font-medium text-white hover:bg-[#02B350] transition cursor-pointer"
            >
              <span class="font-bold text-base">N</span>
              네이버
            </button>

            <!-- 애플 -->
            <button
              @click="handleSocialLogin('apple')"
              class="flex items-center justify-center gap-2 bg-black rounded-lg py-2.5 text-sm font-medium text-white hover:bg-gray-900 transition cursor-pointer"
            >
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
