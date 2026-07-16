<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, User, ShoppingCart } from '@lucide/vue'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { searchApi, categoryApi, cartApi } from '../../lib/api'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const searchQuery = ref('')
const showDropdown = ref(false)

const popularKeywords = ref<string[]>([])
const suggestions = ref<string[]>([])
const suggestedCategories = ref<{ id: number; name: string; fullPath: string }[]>([])
const categories = ref<{ id: number; name: string; slug: string }[]>([])

const totalCount = computed(() => cartStore.totalCount)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

onMounted(() => {
  // 카테고리 로드
  categoryApi.getCategories()
    .then(res => {
      if (res?.data?.data) {
        categories.value = res.data.data
      }
    })
    .catch(err => console.error(err))

  // 인기 검색어 로드
  searchApi.getPopularKeywords()
    .then(res => {
      if (res?.data?.data) {
        popularKeywords.value = res.data.data
      }
    })
    .catch(err => console.error(err))

  // 장바구니 로드
  if (isAuthenticated.value) {
    cartApi.getCartItems()
      .then(res => {
        if (res?.data?.data) {
          cartStore.setItems(res.data.data)
        }
      })
      .catch(err => console.error(err))
  }
})

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    suggestions.value = []
    suggestedCategories.value = []
    return
  }
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    searchApi.getAutocompleteSuggestions(newVal)
      .then(res => {
        if (res?.data?.data) {
          suggestions.value = res.data.data.suggestions || []
          suggestedCategories.value = res.data.data.categories || []
        }
      })
      .catch(err => console.error(err))
  }, 200)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?keyword=${encodeURIComponent(searchQuery.value)}`)
    showDropdown.value = false
  }
}

const hideDropdown = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const handleLogout = () => {
  authStore.clearAuth()
  cartStore.clearCart()
  router.push('/')
}

const highlightMatch = (text: string, query: string) => {
  if (!query) return text
  return text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'))
}
</script>

<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <!-- 상단 바 -->
    <div class="bg-gray-900 text-white text-xs py-1.5">
      <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <span>전 상품 무료배송</span>
        <div class="flex items-center gap-4">
          <template v-if="isAuthenticated">
            <span class="text-gray-300 mr-2">
              <span class="text-indigo-400 font-semibold">{{ user?.name }}님 환영합니다</span>
            </span>
            <router-link to="/mypage" class="hover:text-gray-300">마이페이지</router-link>
            <button @click="handleLogout" class="hover:text-gray-300 cursor-pointer">로그아웃</button>
          </template>
          <template v-else>
            <router-link to="/login" class="hover:text-gray-300">로그인</router-link>
            <router-link to="/signup" class="hover:text-gray-300">회원가입</router-link>
          </template>
        </div>
      </div>
    </div>

    <!-- 메인 헤더 -->
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center gap-6">
        <!-- 로고 -->
        <router-link to="/" class="text-2xl font-bold text-indigo-600 shrink-0">
          ShopMall
        </router-link>

        <!-- 검색창 -->
        <form @submit.prevent="handleSearch" class="flex-1 max-w-2xl">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              @focus="showDropdown = true"
              @blur="hideDropdown"
              placeholder="찾고 싶은 상품을 검색해보세요"
              class="w-full border border-gray-300 rounded-full py-2.5 pl-5 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 cursor-pointer"
            >
              <Search :size="20" />
            </button>

            <!-- 드롭다운 -->
            <div
              v-if="showDropdown"
              class="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-200 ease-out p-4"
            >
              <!-- Suggestions List -->
              <div v-if="searchQuery.trim() && (suggestions.length > 0 || suggestedCategories.length > 0)" class="mb-4">
                <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                  <span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  추천 검색어 및 카테고리
                </h4>
                <ul class="space-y-1">
                  <li>
                    <button
                      type="button"
                      @click="handleSearch"
                      class="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-indigo-50/50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2 font-semibold cursor-pointer"
                    >
                      <Search :size="14" class="text-indigo-500 shrink-0" />
                      <span>
                        <template v-for="(part, i) in highlightMatch(searchQuery, searchQuery)" :key="i">
                          <span :class="part.toLowerCase() === searchQuery.toLowerCase() ? 'text-indigo-600 font-semibold' : ''">{{ part }}</span>
                        </template>
                      </span>
                    </button>
                    
                    <div v-if="suggestedCategories.length > 0" class="pl-6 pr-2 py-1 space-y-1 bg-gray-50/50 rounded-lg mt-1 border border-gray-100/50">
                      <button
                        v-for="cat in suggestedCategories"
                        :key="cat.id"
                        type="button"
                        @click="() => { router.push(`/categories/${cat.id}`); showDropdown = false }"
                        class="w-full text-left pl-3 pr-3 py-1.5 text-xs text-gray-500 hover:bg-indigo-50/70 hover:text-indigo-600 rounded-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <span class="text-indigo-400 font-medium">↳</span>
                        <span class="truncate">
                          <template v-for="(part, i) in highlightMatch(cat.fullPath, searchQuery)" :key="i">
                            <span :class="part.toLowerCase() === searchQuery.toLowerCase() ? 'text-indigo-600 font-semibold' : ''">{{ part }}</span>
                          </template>
                        </span>
                      </button>
                    </div>
                  </li>
                  <div v-if="suggestions.filter(s => s.toLowerCase() !== searchQuery.toLowerCase()).length > 0" class="border-t border-gray-100/80 my-2 px-2"></div>
                  <li v-for="(suggestion, index) in suggestions.filter(s => s.toLowerCase() !== searchQuery.toLowerCase())" :key="index">
                    <button
                      type="button"
                      @click="() => { searchQuery = suggestion; handleSearch() }"
                      class="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-600 rounded-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      <Search :size="14" class="text-gray-400 shrink-0" />
                      <span>
                        <template v-for="(part, i) in highlightMatch(suggestion, searchQuery)" :key="i">
                          <span :class="part.toLowerCase() === searchQuery.toLowerCase() ? 'text-indigo-600 font-semibold' : ''">{{ part }}</span>
                        </template>
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Popular Keywords List -->
              <div v-if="popularKeywords.length > 0">
                <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-2">
                  <span class="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  실시간 인기 검색어
                </h4>
                <div class="grid grid-cols-2 gap-2 p-1">
                  <button
                    v-for="(kw, index) in popularKeywords"
                    :key="index"
                    type="button"
                    @click="() => { searchQuery = kw; handleSearch() }"
                    class="text-left px-3 py-2 text-sm text-gray-700 hover:bg-rose-50/50 hover:text-rose-600 rounded-lg transition flex items-center gap-2 cursor-pointer"
                  >
                    <span :class="['text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center', index < 3 ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-500']">
                      {{ index + 1 }}
                    </span>
                    <span class="truncate">{{ kw }}</span>
                  </button>
                </div>
              </div>

              <!-- Empty state -->
              <div v-if="!searchQuery.trim() && popularKeywords.length === 0" class="text-center py-6 text-gray-400 text-xs">
                인기 검색어가 준비 중입니다.
              </div>
            </div>
          </div>
        </form>

        <!-- 아이콘 영역 -->
        <div class="flex items-center gap-4">
          <router-link
            to="/mypage"
            class="flex flex-col items-center text-gray-600 hover:text-indigo-600"
          >
            <User :size="22" />
            <span class="text-xs mt-0.5">마이페이지</span>
          </router-link>
          <router-link
            to="/cart"
            class="relative flex flex-col items-center text-gray-600 hover:text-indigo-600"
          >
            <ShoppingCart :size="22" />
            <span v-if="totalCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {{ totalCount > 9 ? '9+' : totalCount }}
            </span>
            <span class="text-xs mt-0.5">장바구니</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 카테고리 네비게이션 -->
    <nav class="border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center gap-8 overflow-x-auto scrollbar-hide py-2">
          <router-link
            to="/"
            class="text-sm font-semibold text-indigo-600 shrink-0 hover:text-indigo-800"
          >
            홈
          </router-link>
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/categories/${cat.id}`"
            class="text-sm text-gray-600 shrink-0 hover:text-indigo-600 whitespace-nowrap"
          >
            {{ cat.name }}
          </router-link>
        </div>
      </div>
    </nav>
  </header>
</template>
