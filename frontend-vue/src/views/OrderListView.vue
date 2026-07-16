<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Package, ChevronLeft, Calendar } from '@lucide/vue'
import { useAuthStore } from '../store/authStore'
import { orderApi } from '../lib/api'
import type { Order } from '../types'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const orders = ref<Order[]>([])
const isLoading = ref(true)

const orderStatusMap: Record<string, { text: string; color: string; bg: string }> = {
  PENDING: { text: '결제 대기', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  PAYMENT_DONE: { text: '결제 완료', color: 'text-green-600', bg: 'bg-green-50' },
  PREPARING: { text: '배송 준비 중', color: 'text-blue-600', bg: 'bg-blue-50' },
  SHIPPED: { text: '배송 중', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  DELIVERED: { text: '배송 완료', color: 'text-gray-600', bg: 'bg-gray-50' },
  CANCELLED: { text: '주문 취소', color: 'text-red-600', bg: 'bg-red-50' },
  REFUNDED: { text: '환불 완료', color: 'text-purple-600', bg: 'bg-purple-50' }
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  try {
    const res = await orderApi.getMyOrders({ page: 0, size: 50 })
    orders.value = res.data?.data?.content || []
  } catch (error) {
    console.error('Failed to fetch orders:', error)
  } finally {
    isLoading.value = false
  }
})

const getStatusInfo = (status: string) => {
  return orderStatusMap[status] || { text: status, color: 'text-gray-600', bg: 'bg-gray-50' }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- 헤더 -->
    <div class="flex items-center gap-3 mb-8">
      <button
        @click="router.push('/mypage')"
        class="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition cursor-pointer"
      >
        <ChevronLeft :size="22" />
      </button>
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">전체 주문 내역</h1>
        <p class="text-sm text-gray-400 mt-0.5">고객님께서 주문하신 모든 내역입니다.</p>
      </div>
    </div>

    <div v-if="isLoading" class="p-12 text-center text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto mb-3"></div>
      <p>주문 내역을 불러오는 중입니다...</p>
    </div>
    
    <div v-else-if="orders.length === 0" class="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
      <Package :size="48" class="text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500 font-semibold text-lg mb-1">주문 내역이 없습니다.</p>
      <router-link to="/" class="inline-block mt-4 bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-indigo-700 transition cursor-pointer">
        쇼핑하러 가기
      </router-link>
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-indigo-100 transition">
        <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
          <div class="flex items-center gap-2">
            <Calendar :size="16" class="text-gray-400" />
            <span class="font-bold text-gray-900">{{ formatDate(order.createdAt) }}</span>
            <span class="text-xs text-gray-400 ml-2">주문번호: {{ order.orderNumber }}</span>
          </div>
          <div :class="['px-3 py-1 rounded-full text-xs font-bold', getStatusInfo(order.status).bg, getStatusInfo(order.status).color]">
            {{ getStatusInfo(order.status).text }}
          </div>
        </div>
        
        <div class="flex gap-4 mb-4">
          <div class="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center">
            <img
              v-if="order.items.length > 0 && order.items[0].productThumbnail"
              :src="order.items[0].productThumbnail"
              :alt="order.items[0].productName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-2xl">🛍️</span>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">
              {{ order.items[0].productName }}
              <span v-if="order.items.length > 1" class="text-indigo-600">
                외 {{ order.items.length - 1 }}건
              </span>
            </h3>
            <p class="text-sm text-gray-500 mt-1">총 결제 금액</p>
            <p class="text-lg font-bold text-gray-900">{{ order.finalAmount.toLocaleString() }}원</p>
          </div>
        </div>

        <router-link
          :to="`/orders/${order.id}`"
          class="block w-full py-2 text-center text-sm font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer"
        >
          주문 상세 보기
        </router-link>
      </div>
    </div>
  </div>
</template>
