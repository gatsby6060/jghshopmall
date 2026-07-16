<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const BANNER_KEYS = [
  {
    key: 'spring',
    bgColor: 'from-indigo-600 to-purple-600',
    link: '/categories/1',
    badge: 'NEW',
    title: '봄 시즌 신상품 기획전',
    subtitle: '산뜻한 봄을 맞이하는 새로운 스타일',
    description: '최대 50% 할인된 가격으로 만나보세요'
  },
  {
    key: 'electronics',
    bgColor: 'from-blue-600 to-cyan-600',
    link: '/categories/2',
    badge: 'SALE',
    title: '디지털 가전 특가',
    subtitle: '스마트한 일상을 위한 선택',
    description: '최신 가전제품 파격 할인전'
  },
  {
    key: 'beauty',
    bgColor: 'from-pink-500 to-rose-500',
    link: '/categories/3',
    badge: 'HOT',
    title: '뷰티 베스트셀러',
    subtitle: '빛나는 당신을 위한 뷰티템',
    description: '인기 화장품 단독 특가'
  },
]

const current = ref(0)
let timer: ReturnType<typeof setInterval>

const startTimer = () => {
  timer = setInterval(() => {
    current.value = (current.value + 1) % BANNER_KEYS.length
  }, 4000)
}

const stopTimer = () => {
  clearInterval(timer)
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

const prev = () => {
  current.value = (current.value - 1 + BANNER_KEYS.length) % BANNER_KEYS.length
}

const next = () => {
  current.value = (current.value + 1) % BANNER_KEYS.length
}

const bannerMeta = computed(() => BANNER_KEYS[current.value])
</script>

<template>
  <div 
    :class="['relative bg-gradient-to-r text-white overflow-hidden', bannerMeta.bgColor]"
    @mouseenter="stopTimer"
    @mouseleave="startTimer"
  >
    <div class="max-w-7xl mx-auto px-4 py-20 md:py-28 transition-all duration-500">
      <div class="max-w-xl">
        <span class="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          {{ bannerMeta.badge }}
        </span>
        <h1 class="text-4xl md:text-5xl font-bold mb-3">
          {{ bannerMeta.title }}
        </h1>
        <p class="text-xl md:text-2xl font-light mb-2">
          {{ bannerMeta.subtitle }}
        </p>
        <p class="text-lg opacity-80 mb-8">
          {{ bannerMeta.description }}
        </p>
        <div class="flex gap-4">
          <router-link
            :to="bannerMeta.link"
            class="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            지금 쇼핑하기
          </router-link>
          <router-link
            to="/products"
            class="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            전체 보기
          </router-link>
        </div>
      </div>
    </div>

    <!-- 네비게이션 버튼 -->
    <button
      @click="prev"
      class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition cursor-pointer"
    >
      <ChevronLeft :size="24" />
    </button>
    <button
      @click="next"
      class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition cursor-pointer"
    >
      <ChevronRight :size="24" />
    </button>

    <!-- 인디케이터 -->
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      <button
        v-for="(_, i) in BANNER_KEYS"
        :key="i"
        @click="current = i"
        :class="['h-2 rounded-full transition cursor-pointer', i === current ? 'bg-white w-6' : 'bg-white/50 w-2']"
      />
    </div>
  </div>
</template>
