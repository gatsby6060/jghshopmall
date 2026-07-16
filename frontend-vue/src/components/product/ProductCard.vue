<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart } from '@lucide/vue'
import type { Product } from '../../types'
import { cartApi } from '../../lib/api'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'

const props = defineProps<{
  product: Product
}>()

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const discountRate = computed(() => {
  if (props.product.discountPrice) {
    return Math.round(((props.product.price - props.product.discountPrice) / props.product.price) * 100)
  }
  return 0
})

const handleAddToCart = async (e: Event) => {
  e.preventDefault()
  if (!authStore.isAuthenticated) {
    alert('로그인이 필요합니다.')
    router.push('/login')
    return
  }
  try {
    const res = await cartApi.addToCart({ productId: props.product.id, quantity: 1 })
    cartStore.addItem(res.data.data)
    alert('장바구니에 추가되었습니다.')
  } catch (error) {
    console.error(error)
    alert('장바구니 추가에 실패했습니다.')
  }
}

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
  const parent = target.parentElement
  if (parent) {
    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-5xl bg-gray-100">🛍️</div>'
  }
}

const formatPrice = (price: number) => {
  return Number(price).toLocaleString()
}
</script>

<template>
  <router-link :to="`/products/${product.id}`" class="group block">
    <div class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
      <!-- 상품 이미지 -->
      <div class="relative aspect-square bg-gray-50 overflow-hidden shrink-0">
        <template v-if="product.thumbnailUrl">
          <img
            :src="product.thumbnailUrl"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            @error="handleImageError"
          />
        </template>
        <template v-else>
          <div class="w-full h-full flex items-center justify-center text-5xl bg-gray-100">
            🛍️
          </div>
        </template>
        
        <span v-if="discountRate > 0" class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
          -{{ discountRate }}%
        </span>
        
        <span v-if="product.featured" class="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-md">
          추천
        </span>
        
        <button
          @click.stop="handleAddToCart"
          class="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-600 hover:text-white text-gray-600 cursor-pointer"
        >
          <ShoppingCart :size="16" />
        </button>
      </div>

      <!-- 상품 정보 -->
      <div class="p-3 flex flex-col flex-grow">
        <p v-if="product.brand" class="text-xs text-gray-400 mb-1 font-medium">{{ product.brand }}</p>
        <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-2 leading-snug flex-grow">
          {{ product.name }}
        </h3>
        <div class="flex items-baseline gap-2 flex-wrap">
          <template v-if="product.discountPrice">
            <span class="text-base font-bold text-gray-900">
              {{ formatPrice(product.discountPrice) }}원
            </span>
            <span class="text-xs text-gray-400 line-through">
              {{ formatPrice(product.price) }}원
            </span>
          </template>
          <template v-else>
            <span class="text-base font-bold text-gray-900">
              {{ formatPrice(product.price) }}원
            </span>
          </template>
        </div>
        <p v-if="product.salesCount > 0" class="text-xs text-gray-400 mt-1">{{ formatPrice(product.salesCount) }}개 판매</p>
      </div>
    </div>
  </router-link>
</template>
