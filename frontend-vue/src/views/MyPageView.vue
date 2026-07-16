<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Package, User, MapPin, ChevronRight } from '@lucide/vue'
import { useAuthStore } from '../store/authStore'
import { orderApi } from '../lib/api'
import type { Order } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const orders = ref<Order[]>([])
const isLoading = ref(true)

const orderStatusMap: Record<string, string> = {
  PENDING: '결제 대기',
  PAYMENT_DONE: '결제 완료',
  PREPARING: '배송 준비 중',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '주문 취소',
  REFUNDED: '환불 완료'
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  try {
    const res = await orderApi.getMyOrders({ page: 0, size: 5 })
    orders.value = res.data?.data?.content || []
  } catch (error) {
    console.error('Failed to fetch recent orders:', error)
  } finally {
    isLoading.value = false
  }
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}
</script>

<template>
  <div v-if="!isAuthenticated || !user" class="max-w-4xl mx-auto px-4 py-8 text-center">
    <p>로그인 정보가 없습니다.</p>
  </div>

  <div v-else class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">마이페이지</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- 프로필 카드 -->
      <div class="md:col-span-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <img
              v-if="user.profileImageUrl"
              :src="user.profileImageUrl"
              :alt="user.name"
              class="w-full h-full object-cover"
            />
            <User v-else :size="36" class="text-indigo-600" />
          </div>
          <h2 class="text-lg font-bold text-gray-900">{{ user.name }}</h2>
          <p class="text-sm text-gray-500">{{ user.email }}</p>
          <span v-if="user.role === 'ADMIN'" class="mt-2 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
            관리자
          </span>
        </div>
      </div>

      <!-- 빠른 메뉴 -->
      <div class="md:col-span-2 grid grid-cols-2 gap-4">
        <router-link
          to="/orders"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition"
        >
          <div class="text-indigo-600 bg-indigo-50 p-3 rounded-lg">
            <Package :size="22" />
          </div>
          <div>
            <p class="font-semibold text-gray-900">주문 내역</p>
            <p class="text-xs text-gray-500 mt-0.5">전체 보기</p>
          </div>
          <ChevronRight :size="16" class="text-gray-400 ml-auto" />
        </router-link>

        <router-link
          to="/mypage/addresses"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition"
        >
          <div class="text-green-600 bg-green-50 p-3 rounded-lg">
            <MapPin :size="22" />
          </div>
          <div>
            <p class="font-semibold text-gray-900">배송지 관리</p>
            <p class="text-xs text-gray-500 mt-0.5">전체 보기</p>
          </div>
          <ChevronRight :size="16" class="text-gray-400 ml-auto" />
        </router-link>
      </div>
    </div>

    <!-- 최근 주문 내역 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="flex items-center justify-between p-6 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">최근 주문 내역</h2>
        <router-link to="/orders" class="text-sm text-indigo-600 hover:underline">
          전체 보기
        </router-link>
      </div>
      
      <div v-if="isLoading" class="p-12 text-center text-gray-500">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-3"></div>
        <p>주문 내역을 불러오는 중입니다...</p>
      </div>
      <div v-else-if="orders.length === 0" class="p-12 text-center text-gray-500">
        <Package :size="40" class="mx-auto mb-3 text-gray-300" />
        <p>최근 주문 내역이 없습니다.</p>
      </div>
      <div v-else class="divide-y divide-gray-100">
        <router-link
          v-for="order in orders"
          :key="order.id"
          :to="`/orders/${order.id}`"
          class="flex items-center justify-between p-4 hover:bg-gray-50 transition"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">{{ order.orderNumber }}</p>
            <p class="text-xs text-gray-500 mt-0.5">
              {{ formatDate(order.createdAt) }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm font-bold text-gray-900">
              {{ order.finalAmount.toLocaleString() }}원
            </p>
            <span class="text-xs text-indigo-600">
              {{ orderStatusMap[order.status] || order.status }}
            </span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>
