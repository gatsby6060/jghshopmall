<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeroBanner from '../components/layout/HeroBanner.vue'
import ProductCard from '../components/product/ProductCard.vue'
import { productApi } from '../lib/api'
import type { Product } from '../types'

const featuredProducts = ref<Product[]>([])
const bestProducts = ref<Product[]>([])
const newProducts = ref<Product[]>([])

const isLoadingFeatured = ref(true)
const isLoadingBest = ref(true)
const isLoadingNew = ref(true)

onMounted(() => {
  productApi.getFeaturedProducts()
    .then(res => featuredProducts.value = res.data?.data || [])
    .finally(() => isLoadingFeatured.value = false)

  productApi.getBestProducts()
    .then(res => bestProducts.value = res.data?.data || [])
    .finally(() => isLoadingBest.value = false)

  productApi.getNewProducts()
    .then(res => newProducts.value = res.data?.data || [])
    .finally(() => isLoadingNew.value = false)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <HeroBanner />
    <div class="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <!-- 추천 상품 -->
      <section v-if="isLoadingFeatured || featuredProducts.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">추천 상품</h2>
          <router-link to="/products" class="text-sm text-indigo-600 hover:underline">
            더보기 →
          </router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <template v-if="isLoadingFeatured">
            <div v-for="i in 8" :key="i" class="bg-gray-200 rounded-xl aspect-square animate-pulse" />
          </template>
          <template v-else>
            <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
          </template>
        </div>
      </section>

      <!-- 베스트 상품 -->
      <section v-if="isLoadingBest || bestProducts.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">베스트 상품</h2>
          <router-link to="/products" class="text-sm text-indigo-600 hover:underline">
            더보기 →
          </router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <template v-if="isLoadingBest">
            <div v-for="i in 8" :key="i" class="bg-gray-200 rounded-xl aspect-square animate-pulse" />
          </template>
          <template v-else>
            <ProductCard v-for="product in bestProducts" :key="product.id" :product="product" />
          </template>
        </div>
      </section>

      <!-- 신상품 -->
      <section v-if="isLoadingNew || newProducts.length > 0">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">신상품</h2>
          <router-link to="/products" class="text-sm text-indigo-600 hover:underline">
            더보기 →
          </router-link>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <template v-if="isLoadingNew">
            <div v-for="i in 8" :key="i" class="bg-gray-200 rounded-xl aspect-square animate-pulse" />
          </template>
          <template v-else>
            <ProductCard v-for="product in newProducts" :key="product.id" :product="product" />
          </template>
        </div>
      </section>
    </div>
  </div>
</template>
