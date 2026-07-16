<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { productApi, categoryApi } from '../lib/api'
import ProductCard from '../components/product/ProductCard.vue'
import type { Product, Category } from '../types'

const route = useRoute()

const category = ref<Category | null>(null)
const products = ref<Product[]>([])
const isLoading = ref(true)
const page = ref(0)
const totalPages = ref(0)
const totalElements = ref(0)

const fetchCategoryAndProducts = async () => {
  const categoryId = Number(route.params.id)
  if (!categoryId) return

  isLoading.value = true
  try {
    const [catRes, prodRes] = await Promise.all([
      categoryApi.getCategory(categoryId),
      productApi.getProductsByCategory(categoryId, { page: page.value, size: 20 })
    ])
    
    category.value = catRes.data?.data || null
    products.value = prodRes.data?.data?.content || []
    totalPages.value = prodRes.data?.data?.totalPages || 0
    totalElements.value = prodRes.data?.data?.totalElements || 0
  } catch (error) {
    console.error('Failed to fetch category data:', error)
    products.value = []
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.id, () => {
  page.value = 0
  fetchCategoryAndProducts()
})

watch(() => page.value, () => {
  fetchCategoryAndProducts()
})

onMounted(() => {
  fetchCategoryAndProducts()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">
          {{ category?.name || '카테고리' }}
        </h1>
        <p v-if="!isLoading" class="text-sm text-gray-500 mt-1">
          총 {{ totalElements }}개 상품
        </p>
      </div>
    </div>

    <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-gray-100 rounded-xl aspect-square animate-pulse" />
    </div>
    
    <div v-else-if="products.length === 0" class="text-center py-20 text-gray-500">
      <p class="text-5xl mb-4">🛍️</p>
      <p>해당 카테고리에 상품이 없습니다.</p>
    </div>
    
    <template v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-8">
        <button
          v-for="i in totalPages"
          :key="i"
          @click="page = i - 1"
          :class="[
            'w-9 h-9 rounded-lg text-sm font-medium transition cursor-pointer',
            i - 1 === page
              ? 'bg-indigo-600 text-white'
              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
          ]"
        >
          {{ i }}
        </button>
      </div>
    </template>
  </div>
</template>
