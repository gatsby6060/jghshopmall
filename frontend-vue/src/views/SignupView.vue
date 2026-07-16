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
  name: '',
  phone: '',
  password: '',
  passwordConfirm: ''
})

const errors = reactive({
  email: '',
  name: '',
  password: '',
  passwordConfirm: ''
})

const validate = () => {
  let isValid = true
  errors.email = ''
  errors.name = ''
  errors.password = ''
  errors.passwordConfirm = ''

  if (!formData.email) {
    errors.email = '올바른 이메일을 입력해주세요'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = '올바른 이메일을 입력해주세요'
    isValid = false
  }

  if (!formData.name || formData.name.length < 2) {
    errors.name = '이름은 2자 이상이어야 합니다'
    isValid = false
  }

  if (!formData.password || formData.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다'
    isValid = false
  }

  if (formData.password !== formData.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다'
    isValid = false
  }

  return isValid
}

const onSubmit = async () => {
  if (!validate()) return

  isLoading.value = true
  try {
    const res = await authApi.signup({
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      password: formData.password
    })
    
    const { accessToken, refreshToken, userId, email, name, role } = res.data.data
    
    authStore.setAuth(
      { id: userId, email, name, role, provider: 'LOCAL', createdAt: '' },
      accessToken,
      refreshToken
    )
    
    alert('회원가입이 완료되었습니다!')
    router.push('/')
  } catch (error: any) {
    const message = error.response?.data?.message || '회원가입에 실패했습니다.'
    alert(message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <router-link to="/" class="text-3xl font-bold text-indigo-600">ShopMall</router-link>
        <h2 class="mt-4 text-2xl font-bold text-gray-900">회원가입</h2>
        <p class="mt-2 text-sm text-gray-600">
          이미 계정이 있으신가요?
          <router-link to="/login" class="text-indigo-600 hover:underline font-medium">
            로그인
          </router-link>
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm p-8">
        <form @submit.prevent="onSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이메일 *</label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="example@email.com"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">이름 *</label>
            <input
              v-model="formData.name"
              type="text"
              placeholder="홍길동"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
            <input
              v-model="formData.phone"
              type="text"
              placeholder="010-1234-5678"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호 *</label>
            <input
              v-model="formData.password"
              type="password"
              placeholder="8자 이상 입력해주세요"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인 *</label>
            <input
              v-model="formData.passwordConfirm"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p v-if="errors.passwordConfirm" class="text-red-500 text-xs mt-1">{{ errors.passwordConfirm }}</p>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 mt-2 cursor-pointer"
          >
            {{ isLoading ? '처리 중...' : '회원가입' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
