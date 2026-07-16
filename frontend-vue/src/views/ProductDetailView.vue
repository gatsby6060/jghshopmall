<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ShoppingCart } from '@lucide/vue'
import { productApi, cartApi } from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import type { Product } from '../types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const productId = computed(() => Number(route.params.id))
const product = ref<Product | null>(null)
const isLoading = ref(true)
const quantity = ref(1)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const discountRate = computed(() => {
  if (product.value?.discountPrice) {
    return Math.round(((product.value.price - product.value.discountPrice) / product.value.price) * 100)
  }
  return 0
})

onMounted(async () => {
  try {
    const res = await productApi.getProduct(productId.value)
    product.value = res.data?.data
  } catch (error) {
    console.error('Failed to fetch product:', error)
  } finally {
    isLoading.value = false
  }
})

const handleAddToCart = async () => {
  if (!isAuthenticated.value) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return false
  }
  
  if (!product.value) return false
  
  try {
    const res = await cartApi.addToCart({ productId: product.value.id, quantity: quantity.value })
    cartStore.addItem(res.data.data)
    
    // 장바구니 목록 전체 동기화
    const cartRes = await cartApi.getCartItems()
    if (cartRes?.data?.data) {
      cartStore.setItems(cartRes.data.data)
    }
    
    alert('장바구니에 추가되었습니다.')
    return true
  } catch (error) {
    alert('장바구니 추가에 실패했습니다.')
    return false
  }
}

const handleBuyNow = async () => {
  if (!isAuthenticated.value) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }
  const success = await handleAddToCart()
  if (success) {
    router.push('/cart')
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}
</script>

<template>
  <div v-if="isLoading" class="max-w-7xl mx-auto px-4 py-8">
    <div class="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
      <div class="aspect-square bg-gray-200 rounded-xl" />
      <div class="space-y-4">
        <div class="h-8 bg-gray-200 rounded w-3/4" />
        <div class="h-6 bg-gray-200 rounded w-1/2" />
        <div class="h-10 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  </div>

  <div v-else-if="!product" class="text-center py-20">
    상품을 찾을 수 없습니다.
  </div>

  <div v-else class="max-w-7xl mx-auto px-4 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
      <!-- 상품 이미지 -->
      <div class="aspect-square relative bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <img v-if="product.thumbnailUrl" :src="product.thumbnailUrl" :alt="product.name" class="w-full h-full object-cover" />
        <span v-else class="text-8xl">🛍️</span>
      </div>

      <!-- 상품 정보 -->
      <div class="space-y-5">
        <p v-if="product.brand" class="text-sm text-gray-500 font-medium">{{ product.brand }}</p>
        <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>

        <!-- 가격 -->
        <div class="flex items-baseline gap-3">
          <template v-if="product.discountPrice">
            <span class="text-3xl font-bold text-gray-900">{{ product.discountPrice.toLocaleString() }}원</span>
            <span class="text-lg text-gray-400 line-through">{{ product.price.toLocaleString() }}원</span>
            <span class="text-lg font-bold text-red-500">{{ discountRate }}% 할인</span>
          </template>
          <template v-else>
            <span class="text-3xl font-bold text-gray-900">{{ product.price.toLocaleString() }}원</span>
          </template>
        </div>

        <!-- 배송 정보 -->
        <div class="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-500">배송비</span>
            <span class="font-medium">
              {{ (product.discountPrice && product.discountPrice >= 50000) || product.price >= 50000 ? '무료배송' : '3,000원' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">재고</span>
            <span :class="['font-medium', product.stock > 0 ? 'text-green-600' : 'text-red-500']">
              {{ product.stock > 0 ? `${product.stock}개 남음` : '품절' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">카테고리</span>
            <span class="font-medium">{{ product.categoryName }}</span>
          </div>
        </div>

        <!-- 수량 선택 -->
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">수량</span>
          <div class="flex items-center border border-gray-300 rounded-lg">
            <button @click="decreaseQuantity" class="px-3 py-2 hover:bg-gray-100 cursor-pointer">-</button>
            <span class="px-4 py-2 font-medium">{{ quantity }}</span>
            <button @click="increaseQuantity" class="px-3 py-2 hover:bg-gray-100 cursor-pointer">+</button>
          </div>
        </div>

        <!-- 구매 버튼 -->
        <div class="flex gap-3">
          <button
            @click="handleAddToCart"
            :disabled="product.stock === 0"
            class="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-600 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <ShoppingCart :size="18" />
            장바구니 담기
          </button>
          <button
            @click="handleBuyNow"
            :disabled="product.stock === 0"
            class="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            바로 구매
          </button>
        </div>

        <!-- 상품 설명 -->
        <div v-if="product.description" class="border-t pt-5">
          <h3 class="font-semibold text-gray-900 mb-3">상품 설명</h3>
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {{ product.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
