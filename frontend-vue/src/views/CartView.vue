<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Trash2, ShoppingBag } from '@lucide/vue'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { cartApi } from '../lib/api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const items = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const shippingFee = computed(() => totalPrice.value >= 50000 ? 0 : 3000)
const finalAmount = computed(() => totalPrice.value + shippingFee.value)

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      const res = await cartApi.getCartItems()
      if (res?.data?.data) {
        cartStore.setItems(res.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error)
    }
  }
})

const handleUpdateQuantity = async (id: number, quantity: number) => {
  try {
    await cartApi.updateQuantity(id, quantity)
    cartStore.updateItem(id, quantity)
  } catch (error) {
    alert('수량 변경에 실패했습니다.')
  }
}

const handleRemove = async (id: number) => {
  try {
    await cartApi.removeFromCart(id)
    cartStore.removeItem(id)
    alert('장바구니에서 삭제되었습니다.')
  } catch (error) {
    alert('삭제에 실패했습니다.')
  }
}

const getPrice = (item: any): number => {
  return item.discountPrice ? Number(item.discountPrice) : Number(item.price || 0)
}
</script>

<template>
  <div v-if="!isAuthenticated" class="max-w-7xl mx-auto px-4 py-20 text-center">
    <ShoppingBag :size="64" class="mx-auto text-gray-300 mb-4" />
    <h2 class="text-xl font-semibold text-gray-700 mb-4">로그인이 필요한 서비스입니다</h2>
    <router-link
      to="/login"
      class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
    >
      로그인하기
    </router-link>
  </div>

  <div v-else-if="items.length === 0" class="max-w-7xl mx-auto px-4 py-20 text-center">
    <ShoppingBag :size="64" class="mx-auto text-gray-300 mb-4" />
    <h2 class="text-xl font-semibold text-gray-700 mb-2">장바구니가 비어있습니다</h2>
    <p class="text-gray-500 mb-6">원하는 상품을 장바구니에 담아보세요.</p>
    <router-link
      to="/"
      class="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
    >
      쇼핑 계속하기
    </router-link>
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 장바구니 아이템 목록 -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="item in items" :key="item.id" class="bg-white rounded-xl p-4 shadow-sm flex gap-4">
          <div class="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
            <img v-if="item.productThumbnail" :src="item.productThumbnail" :alt="item.productName" class="w-full h-full object-cover" />
            <span v-else class="text-2xl">🛍️</span>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-gray-900 line-clamp-2">{{ item.productName }}</h3>
            <p class="text-indigo-600 font-bold mt-1">
              {{ getPrice(item).toLocaleString() }}원
            </p>
            <div class="flex items-center gap-3 mt-2">
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="handleUpdateQuantity(item.id || item.productId, Math.max(1, item.quantity - 1))"
                  class="px-2 py-1 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  -
                </button>
                <span class="px-3 py-1 text-sm">{{ item.quantity }}</span>
                <button
                  @click="handleUpdateQuantity(item.id || item.productId, Math.min(item.stock, item.quantity + 1))"
                  class="px-2 py-1 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
              <button
                @click="handleRemove(item.id || item.productId)"
                class="text-gray-400 hover:text-red-500 transition cursor-pointer"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
          <div class="text-right shrink-0">
            <p class="font-bold text-gray-900">
              {{ (getPrice(item) * item.quantity).toLocaleString() }}원
            </p>
          </div>
        </div>
      </div>

      <!-- 주문 요약 -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
          <h2 class="text-lg font-bold text-gray-900 mb-4">주문 요약</h2>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">상품 금액</span>
              <span>{{ totalPrice.toLocaleString() }}원</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">배송비</span>
              <span>{{ shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원` }}</span>
            </div>
            <p v-if="shippingFee > 0" class="text-xs text-gray-400">
              {{ (50000 - totalPrice).toLocaleString() }}원 추가 주문 시 무료배송
            </p>
            <div class="border-t pt-3 flex justify-between font-bold text-base">
              <span>총 결제 금액</span>
              <span class="text-indigo-600">{{ finalAmount.toLocaleString() }}원</span>
            </div>
          </div>
          <button
            @click="() => router.push('/checkout')"
            class="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition cursor-pointer"
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
