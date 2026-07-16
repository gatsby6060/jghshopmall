<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, CreditCard, Truck, Calendar, ArrowLeft, ShoppingBag } from '@lucide/vue'
import { orderApi } from '../lib/api'
import type { Order } from '../types'

const route = useRoute()
const router = useRouter()

const orderId = Number(route.params.id)
const isSuccess = route.query.success === 'true'

const order = ref<Order | null>(null)
const isLoading = ref(true)
const isError = ref(false)

const statusMap: Record<string, { text: string; color: string; bg: string }> = {
  PENDING: { text: '결제 대기', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  PAYMENT_DONE: { text: '결제 완료', color: 'text-green-600', bg: 'bg-green-50' },
  PREPARING: { text: '배송 준비 중', color: 'text-blue-600', bg: 'bg-blue-50' },
  SHIPPED: { text: '배송 중', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  DELIVERED: { text: '배송 완료', color: 'text-gray-600', bg: 'bg-gray-50' },
  CANCELLED: { text: '주문 취소', color: 'text-red-600', bg: 'bg-red-50' },
  REFUNDED: { text: '환불 완료', color: 'text-purple-600', bg: 'bg-purple-50' },
}

onMounted(async () => {
  if (!orderId) {
    isError.value = true
    isLoading.value = false
    return
  }

  try {
    const res = await orderApi.getOrder(orderId)
    order.value = res.data?.data
  } catch (error) {
    console.error('Failed to fetch order:', error)
    isError.value = true
  } finally {
    isLoading.value = false
  }
})

const getStatusInfo = (status: string) => {
  return statusMap[status] || { text: status, color: 'text-gray-600', bg: 'bg-gray-50' }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR')
}
</script>

<template>
  <div v-if="isLoading" class="max-w-4xl mx-auto px-4 py-32 text-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
    <p class="text-gray-500 mt-4 text-sm">주문 정보를 불러오는 중입니다...</p>
  </div>

  <div v-else-if="isError || !order" class="max-w-4xl mx-auto px-4 py-20 text-center">
    <div class="text-red-500 text-5xl mb-4">⚠️</div>
    <h2 class="text-xl font-bold text-gray-900 mb-2">주문 내역을 찾을 수 없습니다</h2>
    <p class="text-gray-500 mb-8">주문 정보가 올바르지 않거나 이미 만료되었을 수 있습니다.</p>
    <button
      @click="router.push('/mypage')"
      class="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
    >
      마이페이지로 가기
    </button>
  </div>

  <div v-else class="max-w-4xl mx-auto px-4 py-8">
    <!-- 주문 완료 축하 헤더 (success=true 일 때 노출) -->
    <div v-if="isSuccess" class="mb-10 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100/50 shadow-sm animate-fade-in">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full mb-4">
        <CheckCircle :size="36" />
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">주문이 성공적으로 완료되었습니다!</h1>
      <p class="text-gray-500 text-sm mb-1">안전하고 신속하게 배송해 드리겠습니다.</p>
      <p class="text-xs text-indigo-600 font-medium">주문번호: {{ order.orderNumber }}</p>
    </div>

    <!-- 헤더 및 마이페이지 바로가기 -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">주문 상세 내역</h2>
        <p class="text-gray-500 text-xs mt-1">
          주문일시: {{ formatDate(order.createdAt) }}
        </p>
      </div>
      <router-link
        to="/mypage"
        class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 font-medium transition"
      >
        <ArrowLeft :size="16" />
        주문 내역 전체 보기
      </router-link>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 주문 상품 & 배송 정보 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 상품 목록 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingBag :size="20" class="text-indigo-600" />
            주문 상품 정보 ({{ order.items.length }}개)
          </h3>
          <div class="divide-y divide-gray-100">
            <div v-for="item in order.items" :key="item.id" class="py-4 first:pt-0 last:pb-0 flex gap-4">
              <div class="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 flex justify-center items-center">
                <img
                  v-if="item.productThumbnail"
                  :src="item.productThumbnail"
                  :alt="item.productName"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xl">🛍️</span>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 text-sm truncate">{{ item.productName }}</h4>
                <p class="text-gray-400 text-xs mt-1">
                  수량: {{ item.quantity }}개
                </p>
                <p class="text-indigo-600 font-bold text-sm mt-1">
                  {{ item.unitPrice.toLocaleString() }}원
                </p>
              </div>
              <div class="text-right shrink-0">
                <p class="font-bold text-gray-900 text-sm">
                  {{ item.totalPrice.toLocaleString() }}원
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 배송 정보 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Truck :size="20" class="text-indigo-600" />
            배송지 정보
          </h3>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b border-gray-50">
                <td class="py-3 text-gray-400 font-medium w-28">수령인</td>
                <td class="py-3 text-gray-900 font-semibold">{{ order.receiverName }}</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="py-3 text-gray-400 font-medium">연락처</td>
                <td class="py-3 text-gray-900">{{ order.receiverPhone }}</td>
              </tr>
              <tr class="border-b border-gray-50">
                <td class="py-3 text-gray-400 font-medium">배송지 주소</td>
                <td class="py-3 text-gray-900">
                  <span class="inline-block bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded font-mono mb-1 mr-2">
                    {{ order.zipCode }}
                  </span>
                  <p class="inline">{{ order.address }}</p>
                  <p v-if="order.addressDetail" class="text-gray-500 mt-1">{{ order.addressDetail }}</p>
                </td>
              </tr>
              <tr v-if="order.orderMemo">
                <td class="py-3 text-gray-400 font-medium">배송 요청사항</td>
                <td class="py-3 text-gray-500 italic">{{ order.orderMemo }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 주문 요약 / 상태 -->
      <div class="lg:col-span-1 space-y-6">
        <!-- 주문 상태 카드 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar :size="18" class="text-indigo-600" />
            주문 상태
          </h3>
          <div :class="['w-full py-3 rounded-xl font-bold text-center text-sm', getStatusInfo(order.status).bg, getStatusInfo(order.status).color]">
            {{ getStatusInfo(order.status).text }}
          </div>
          <p class="text-xs text-gray-400 text-center mt-2">
            주문 번호: {{ order.orderNumber }}
          </p>
        </div>

        <!-- 결제 정보 카드 -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard :size="18" class="text-indigo-600" />
            결제 금액 상세
          </h3>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">주문 상품 금액</span>
              <span class="text-gray-900 font-medium">{{ order.totalAmount.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">할인 금액</span>
              <span class="text-red-500 font-medium">-{{ order.discountAmount.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">배송비</span>
              <span class="text-gray-900 font-medium">
                {{ order.shippingFee === 0 ? '무료' : `+${order.shippingFee.toLocaleString()}원` }}
              </span>
            </div>
            <div class="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
              <span>최종 결제 금액</span>
              <span class="text-indigo-600 text-lg">{{ order.finalAmount.toLocaleString() }}원</span>
            </div>
          </div>

          <div class="border-t border-gray-100 mt-4 pt-4 text-xs text-gray-400 space-y-1">
            <p>• 결제 수단: 신용카드 (포트원 KG이니시스)</p>
            <p>• KG이니시스 테스트 결제건은 당일 밤 11시 50분경 자동으로 결제가 안전하게 취소됩니다.</p>
          </div>
        </div>

        <!-- 메인 및 쇼핑 계속하기 버튼 -->
        <div class="space-y-3 pt-2">
          <router-link
            to="/"
            class="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:bg-indigo-700 transition text-sm"
          >
            쇼핑 계속하기
          </router-link>
          <router-link
            to="/mypage"
            class="w-full flex items-center justify-center bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition text-sm"
          >
            주문 내역서 확인
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
