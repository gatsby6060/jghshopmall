<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, Plus, Star, Pencil, Trash2, Check, X, ChevronLeft, Home, Building2 } from '@lucide/vue'
import { useAuthStore } from '../store/authStore'
import { addressApi } from '../lib/api'

const router = useRouter()
const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const addresses = ref<any[]>([])
const isLoading = ref(true)
const showForm = ref(false)
const editingId = ref<number | null>(null)
const deleteConfirmId = ref<number | null>(null)
const isMutating = ref(false)

const emptyForm = {
  alias: '',
  receiverName: '',
  receiverPhone: '',
  zipCode: '',
  address: '',
  addressDetail: '',
  isDefault: false,
}

const form = reactive({ ...emptyForm })
const errors = reactive<Record<string, string>>({})

const fetchAddresses = async () => {
  try {
    isLoading.value = true
    const res = await addressApi.getAddresses()
    addresses.value = res.data?.data || []
  } catch (error) {
    console.error('Failed to fetch addresses:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  fetchAddresses()
})

const resetForm = () => {
  Object.assign(form, emptyForm)
  editingId.value = null
  showForm.value = false
  Object.keys(errors).forEach(key => delete errors[key])
}

const formatPhone = (v: string) => {
  const n = v.replace(/[^\d]/g, '')
  if (n.startsWith('02')) {
    if (n.length <= 5) return n.replace(/(\d{2})(\d+)/, '$1-$2')
    if (n.length <= 9) return n.replace(/(\d{2})(\d{3})(\d+)/, '$1-$2-$3')
    return n.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
  }
  if (n.length <= 6) return n.replace(/(\d{3})(\d+)/, '$1-$2')
  if (n.length <= 10) return n.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3')
  return n.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
}

const handlePhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  form.receiverPhone = formatPhone(target.value)
}

const handleAddressSearch = () => {
  if (typeof window !== 'undefined' && window.daum) {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let full = data.address
        if (data.userSelectedType === 'R') {
          const extra = [data.bname, data.buildingName].filter(Boolean).join(', ')
          if (extra) full += ` (${extra})`
        }
        form.zipCode = data.zonecode
        form.address = full
        delete errors.zipCode
        delete errors.address
        
        const detailInput = document.getElementById('addressDetailInput')
        if (detailInput) detailInput.focus()
      }
    }).open()
  } else {
    alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
  }
}

const validate = () => {
  let isValid = true
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.alias.trim()) { errors.alias = '별칭을 입력해주세요.'; isValid = false }
  if (!form.receiverName.trim()) { errors.receiverName = '수령인 이름을 입력해주세요.'; isValid = false }
  if (!form.receiverPhone.trim()) { errors.receiverPhone = '전화번호를 입력해주세요.'; isValid = false }
  if (!form.zipCode.trim()) { errors.zipCode = '우편번호를 입력해주세요.'; isValid = false }
  if (!form.address.trim()) { errors.address = '주소를 입력해주세요.'; isValid = false }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isMutating.value = true
  try {
    if (editingId.value !== null) {
      await addressApi.updateAddress(editingId.value, { ...form })
      alert('배송지가 수정되었습니다!')
    } else {
      await addressApi.addAddress({ ...form })
      alert('배송지가 추가되었습니다!')
    }
    fetchAddresses()
    resetForm()
  } catch (error: any) {
    alert(error.response?.data?.message || '배송지 저장에 실패했습니다.')
  } finally {
    isMutating.value = false
  }
}

const handleEdit = (addr: any) => {
  form.alias = addr.alias
  form.receiverName = addr.receiverName
  form.receiverPhone = addr.receiverPhone
  form.zipCode = addr.zipCode
  form.address = addr.address
  form.addressDetail = addr.addressDetail || ''
  form.isDefault = addr.isDefault
  
  editingId.value = addr.id
  showForm.value = true
  Object.keys(errors).forEach(key => delete errors[key])
}

const handleDelete = async (id: number) => {
  try {
    await addressApi.deleteAddress(id)
    alert('배송지가 삭제되었습니다.')
    deleteConfirmId.value = null
    fetchAddresses()
  } catch (error) {
    alert('배송지 삭제에 실패했습니다.')
  }
}

const handleSetDefault = async (id: number) => {
  try {
    await addressApi.setDefaultAddress(id)
    alert('기본 배송지가 변경되었습니다!')
    fetchAddresses()
  } catch (error) {
    alert('기본 배송지 변경에 실패했습니다.')
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-8">
    <!-- 헤더 -->
    <div class="flex items-center gap-3 mb-8">
      <button
        @click="router.push('/mypage')"
        class="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition cursor-pointer"
      >
        <ChevronLeft :size="22" />
      </button>
      <div>
        <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">배송지 관리</h1>
        <p class="text-sm text-gray-400 mt-0.5">자주 쓰는 배송지를 최대 10개까지 저장할 수 있습니다.</p>
      </div>
      <div class="ml-auto">
        <button
          v-if="!showForm"
          @click="resetForm(); showForm = true"
          :disabled="addresses.length >= 10"
          class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
        >
          <Plus :size="16" />
          새 배송지 추가
        </button>
      </div>
    </div>

    <!-- 배송지 추가/수정 폼 -->
    <div v-if="showForm" class="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 mb-6 ring-2 ring-indigo-50">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-lg font-bold text-gray-900">
          {{ editingId ? '배송지 수정' : '새 배송지 추가' }}
        </h2>
        <button @click="resetForm" class="text-gray-400 hover:text-gray-700 transition cursor-pointer">
          <X :size="20" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 별칭 -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">별칭 <span class="text-red-500">*</span></label>
          <div class="flex gap-2 mb-1">
            <button
              v-for="tag in ['집', '회사', '학교']"
              :key="tag"
              type="button"
              @click="form.alias = tag"
              :class="['text-xs px-3 py-1.5 rounded-full border font-semibold transition cursor-pointer', form.alias === tag ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300']"
            >
              <span v-if="tag === '집'" class="flex items-center gap-1"><Home :size="11" />{{ tag }}</span>
              <span v-else-if="tag === '회사'" class="flex items-center gap-1"><Building2 :size="11" />{{ tag }}</span>
              <span v-else>{{ tag }}</span>
            </button>
          </div>
          <input
            v-model="form.alias"
            placeholder="예: 집, 회사, 부모님댁"
            :class="['w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400', errors.alias ? 'border-red-400' : 'border-gray-200']"
          />
          <p v-if="errors.alias" class="text-red-500 text-xs mt-1">{{ errors.alias }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- 수령인 -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">수령인 이름 <span class="text-red-500">*</span></label>
            <input
              v-model="form.receiverName"
              placeholder="홍길동"
              :class="['w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400', errors.receiverName ? 'border-red-400' : 'border-gray-200']"
            />
            <p v-if="errors.receiverName" class="text-red-500 text-xs mt-1">{{ errors.receiverName }}</p>
          </div>

          <!-- 전화번호 -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">전화번호 <span class="text-red-500">*</span></label>
            <input
              v-model="form.receiverPhone"
              @input="handlePhoneInput"
              placeholder="010-1234-5678"
              maxlength="13"
              :class="['w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400', errors.receiverPhone ? 'border-red-400' : 'border-gray-200']"
            />
            <p v-if="errors.receiverPhone" class="text-red-500 text-xs mt-1">{{ errors.receiverPhone }}</p>
          </div>
        </div>

        <!-- 우편번호 -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">주소 <span class="text-red-500">*</span></label>
          <div class="flex gap-2 mb-2">
            <input
              v-model="form.zipCode"
              readonly
              @click="handleAddressSearch"
              placeholder="우편번호"
              :class="['flex-none w-32 border rounded-xl px-3 py-2.5 text-sm bg-gray-50 cursor-pointer focus:outline-none', errors.zipCode ? 'border-red-400' : 'border-gray-200']"
            />
            <button
              type="button"
              @click="handleAddressSearch"
              class="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition cursor-pointer"
            >
              주소 검색
            </button>
          </div>
          <input
            v-model="form.address"
            readonly
            @click="handleAddressSearch"
            placeholder="주소 검색 버튼을 눌러 주소를 입력해주세요"
            :class="['w-full border rounded-xl px-3 py-2.5 text-sm bg-gray-50 cursor-pointer focus:outline-none mb-2', errors.address ? 'border-red-400' : 'border-gray-200']"
          />
          <input
            id="addressDetailInput"
            v-model="form.addressDetail"
            placeholder="상세 주소 (동/호수 등)"
            class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <p v-if="errors.zipCode || errors.address" class="text-red-500 text-xs mt-1">주소를 입력해주세요.</p>
        </div>

        <!-- 기본 배송지 -->
        <label class="flex items-center gap-2.5 cursor-pointer group">
          <div
            class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition"
            :class="[form.isDefault ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400']"
          >
            <input type="checkbox" v-model="form.isDefault" class="hidden" />
            <Check v-if="form.isDefault" :size="12" class="text-white" :stroke-width="3" />
          </div>
          <span class="text-sm font-semibold text-gray-700">기본 배송지로 설정</span>
        </label>

        <!-- 버튼 -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="resetForm"
            class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="isMutating"
            class="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition disabled:opacity-60 cursor-pointer"
          >
            {{ isMutating ? '저장 중...' : editingId ? '수정 완료' : '추가 완료' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 배송지 목록 -->
    <div v-if="isLoading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/4 mb-3" />
        <div class="h-3 bg-gray-100 rounded w-1/2 mb-2" />
        <div class="h-3 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
    
    <div v-else-if="addresses.length === 0" class="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
      <MapPin :size="48" class="text-gray-200 mx-auto mb-4" />
      <p class="text-gray-500 font-semibold text-lg mb-1">등록된 배송지가 없습니다</p>
      <p class="text-gray-400 text-sm">위의 '새 배송지 추가' 버튼을 눌러 첫 배송지를 등록해 보세요!</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        :class="['bg-white rounded-2xl p-5 shadow-sm border transition group', addr.isDefault ? 'border-indigo-300 ring-2 ring-indigo-50' : 'border-gray-100 hover:border-gray-200']"
      >
        <!-- 삭제 확인 모달 -->
        <div v-if="deleteConfirmId === addr.id" class="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex flex-col gap-3">
          <p class="text-sm font-semibold text-red-700">
            '{{ addr.alias }}' 배송지를 삭제하시겠습니까?
          </p>
          <div class="flex gap-2">
            <button
              @click="handleDelete(addr.id)"
              class="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-lg transition cursor-pointer"
            >
              삭제
            </button>
            <button
              @click="deleteConfirmId = null"
              class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg transition cursor-pointer"
            >
              취소
            </button>
          </div>
        </div>

        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5 flex-1 min-w-0">
            <div :class="['p-2 rounded-lg shrink-0', addr.isDefault ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500']">
              <MapPin :size="16" />
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-bold text-gray-900">{{ addr.alias }}</span>
                <span v-if="addr.isDefault" class="text-[11px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <Star :size="9" fill="white" /> 기본
                </span>
              </div>
              <p class="text-sm font-semibold text-gray-700 mt-0.5">
                {{ addr.receiverName }} · {{ addr.receiverPhone }}
              </p>
              <p class="text-sm text-gray-500 mt-0.5 truncate">
                [{{ addr.zipCode }}] {{ addr.address }} {{ addr.addressDetail ? addr.addressDetail : '' }}
              </p>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="flex items-center gap-1.5 shrink-0">
            <button
              v-if="!addr.isDefault"
              @click="handleSetDefault(addr.id)"
              title="기본 배송지로 설정"
              class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition text-xs font-semibold cursor-pointer"
            >
              <Star :size="16" />
            </button>
            <button
              @click="handleEdit(addr)"
              title="수정"
              class="p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            >
              <Pencil :size="15" />
            </button>
            <button
              @click="deleteConfirmId = deleteConfirmId === addr.id ? null : addr.id"
              title="삭제"
              class="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
            >
              <Trash2 :size="15" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 개수 카운터 -->
    <p v-if="addresses.length > 0" class="text-center text-xs text-gray-400 mt-6 font-medium">
      {{ addresses.length }} / 10개 등록됨
      <span v-if="addresses.length >= 10" class="text-red-400 ml-2">· 최대 개수에 도달했습니다.</span>
    </p>
  </div>
</template>
