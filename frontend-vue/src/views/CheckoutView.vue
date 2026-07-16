<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { MapPin, ChevronDown } from '@lucide/vue'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import { orderApi, paymentApi, cartApi, addressApi } from '../lib/api'

// 전역 변수 타입 선언
declare global {
  interface Window {
    daum?: any
    IMP?: any
  }
}

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const items = computed(() => cartStore.items)
const totalPrice = computed(() => cartStore.totalPrice)
const shippingFee = computed(() => totalPrice.value >= 50000 ? 0 : 3000)
const finalAmount = computed(() => totalPrice.value + shippingFee.value)
const user = computed(() => authStore.user)

const isLoading = ref(false)
const showAddressBook = ref(false)
const addresses = ref<any[]>([])

const formData = reactive({
  receiverName: user.value?.name || '',
  receiverPhone: user.value?.phone || '',
  zipCode: '',
  address: '',
  addressDetail: '',
  orderMemo: ''
})

const errors = reactive({
  receiverName: '',
  receiverPhone: '',
  zipCode: '',
  address: ''
})

onMounted(async () => {
  if (user.value) {
    try {
      const res = await addressApi.getAddresses()
      addresses.value = res.data?.data || []
      
      const defaultAddr = addresses.value.find(addr => addr.isDefault)
      if (defaultAddr) {
        formData.receiverName = defaultAddr.receiverName
        formData.receiverPhone = defaultAddr.receiverPhone
        formData.zipCode = defaultAddr.zipCode
        formData.address = defaultAddr.address
        formData.addressDetail = defaultAddr.addressDetail || ''
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
    }
  }
})

const formatPhoneNumber = (value: string) => {
  if (!value) return value
  const cleanNumber = value.replace(/[^\d]/g, '')
  
  if (cleanNumber.startsWith('02')) {
    if (cleanNumber.length <= 2) return cleanNumber
    if (cleanNumber.length <= 5) return `${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2)}`
    if (cleanNumber.length <= 9) return `${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2, 5)}-${cleanNumber.slice(5)}`
    return `${cleanNumber.slice(0, 2)}-${cleanNumber.slice(2, 6)}-${cleanNumber.slice(6, 10)}`
  } else {
    if (cleanNumber.length <= 3) return cleanNumber
    if (cleanNumber.length <= 6) return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3)}`
    if (cleanNumber.length <= 10) return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6)}`
    return `${cleanNumber.slice(0, 3)}-${cleanNumber.slice(3, 7)}-${cleanNumber.slice(7, 11)}`
  }
}

const handlePhoneInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  formData.receiverPhone = formatPhoneNumber(target.value)
}

const handleAddressSearch = () => {
  if (typeof window !== 'undefined' && window.daum) {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        let fullAddress = data.address
        let extraAddress = ''

        if (data.userSelectedType === 'R') {
          if (data.bname !== '') extraAddress += data.bname
          if (data.buildingName !== '') extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
        }

        formData.zipCode = data.zonecode
        formData.address = fullAddress
        
        // 상세주소로 포커스
        const detailInput = document.getElementById('addressDetailInput')
        if (detailInput) detailInput.focus()
      }
    }).open()
  } else {
    alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
  }
}

const selectAddress = (addr: any) => {
  formData.receiverName = addr.receiverName
  formData.receiverPhone = addr.receiverPhone
  formData.zipCode = addr.zipCode
  formData.address = addr.address
  formData.addressDetail = addr.addressDetail || ''
  showAddressBook.value = false
}

const validate = () => {
  let isValid = true
  errors.receiverName = ''
  errors.receiverPhone = ''
  errors.zipCode = ''
  errors.address = ''

  if (!formData.receiverName) {
    errors.receiverName = '수령인 이름을 입력해주세요'
    isValid = false
  }
  if (!formData.receiverPhone || formData.receiverPhone.length < 10) {
    errors.receiverPhone = '올바른 전화번호를 입력해주세요'
    isValid = false
  }
  if (!formData.zipCode) {
    errors.zipCode = '우편번호를 입력해주세요'
    isValid = false
  }
  if (!formData.address) {
    errors.address = '주소를 입력해주세요'
    isValid = false
  }

  return isValid
}

const onSubmit = async () => {
  if (items.value.length === 0) {
    alert('장바구니가 비어있습니다.')
    return
  }

  if (!validate()) return

  isLoading.value = true
  try {
    // 1. 주문 생성
    const orderItems = items.value.map(item => ({ productId: item.productId, quantity: item.quantity }))
    const orderRes = await orderApi.createOrder({
      items: orderItems,
      ...formData
    })
    const order = orderRes.data.data

    // 2. 포트원 결제
    if (typeof window !== 'undefined' && window.IMP) {
      const { IMP } = window
      const storeCode = import.meta.env.VITE_PORTONE_STORE_CODE || 'imp19421636'
      IMP.init(storeCode)

      const orderName = orderItems.length === 1 
        ? items.value[0].productName 
        : `${items.value[0].productName} 외 ${orderItems.length - 1}건`

      IMP.request_pay({
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: order.orderNumber,
        name: orderName,
        amount: finalAmount.value,
        buyer_email: user.value?.email || '',
        buyer_name: user.value?.name || formData.receiverName,
        buyer_tel: user.value?.phone || formData.receiverPhone,
        buyer_addr: `${formData.address} ${formData.addressDetail || ''}`,
        buyer_postcode: formData.zipCode,
        m_redirect_url: `${window.location.origin}/orders/${order.id}?success=true`,
      }, async (rsp: any) => {
        if (rsp.success) {
          try {
            isLoading.value = true
            // 3. 결제 검증
            await paymentApi.confirmPayment({
              paymentKey: rsp.imp_uid,
              orderId: rsp.merchant_uid,
              amount: rsp.paid_amount,
            })

            try {
              await cartApi.clearCart()
            } catch (err) {}
            cartStore.clearCart()
            
            alert('결제가 완료되었습니다!')
            router.push(`/orders/${order.id}?success=true`)
          } catch (err: any) {
            alert(err.message || '결제 검증에 실패했습니다.')
          } finally {
            isLoading.value = false
          }
        } else {
          alert(rsp.error_msg || '결제에 실패했습니다.')
          isLoading.value = false
        }
      })
    } else {
      // SDK 미로드 시 모의 결제
      alert('주문이 완료되었습니다! (테스트 모드)')
      try {
        await cartApi.clearCart()
      } catch (err) {}
      cartStore.clearCart()
      router.push(`/orders/${order.id}?success=true`)
    }
  } catch (error: any) {
    alert(error.response?.data?.message || error.message || '결제에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">주문/결제</h1>

    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 배송지 정보 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">배송지 정보</h2>
              <button
                v-if="addresses.length === 0"
                type="button"
                @click="router.push('/mypage/addresses')"
                class="text-xs text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition cursor-pointer"
              >
                + 배송지 추가/관리
              </button>
            </div>

            <div v-if="addresses.length > 0" class="mb-6 border border-indigo-100 rounded-xl bg-indigo-50/50 p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600">
                    <MapPin :size="14" />
                  </span>
                  <span class="text-sm font-bold text-gray-800">등록된 배송지 목록 ({{ addresses.length }}개)</span>
                </div>
                <button
                  type="button"
                  @click="showAddressBook = !showAddressBook"
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  {{ showAddressBook ? '접기' : '선택하기' }}
                  <ChevronDown :size="14" :class="['transition-transform duration-200', showAddressBook ? 'rotate-180' : '']" />
                </button>
              </div>

              <div v-if="showAddressBook" class="mt-3 space-y-2 border-t border-indigo-100/50 pt-3 max-h-60 overflow-y-auto pr-1">
                <div
                  v-for="addr in addresses"
                  :key="addr.id"
                  @click="selectAddress(addr)"
                  class="p-3 bg-white hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 rounded-xl cursor-pointer transition flex items-start justify-between gap-3 group"
                >
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                        {{ addr.alias }}
                      </span>
                      <span v-if="addr.isDefault" class="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        ★ 기본
                      </span>
                      <span class="text-xs font-semibold text-gray-700">{{ addr.receiverName }} ({{ addr.receiverPhone }})</span>
                    </div>
                    <p class="text-xs text-gray-500 mt-1 truncate">
                      [{{ addr.zipCode }}] {{ addr.address }} {{ addr.addressDetail || '' }}
                    </p>
                  </div>
                  <span class="shrink-0 text-xs font-bold text-gray-400 group-hover:text-indigo-600 transition self-center">
                    선택
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">수령인 이름 *</label>
                <input
                  v-model="formData.receiverName"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p v-if="errors.receiverName" class="text-red-500 text-xs mt-1">{{ errors.receiverName }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">전화번호 *</label>
                <input
                  v-model="formData.receiverPhone"
                  @input="handlePhoneInput"
                  placeholder="010-1234-5678"
                  maxlength="13"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p v-if="errors.receiverPhone" class="text-red-500 text-xs mt-1">{{ errors.receiverPhone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">우편번호 *</label>
                <div class="flex gap-2">
                  <input
                    v-model="formData.zipCode"
                    placeholder="우편번호"
                    readonly
                    @click="handleAddressSearch"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-pointer focus:outline-none"
                  />
                  <button
                    type="button"
                    @click="handleAddressSearch"
                    class="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700 transition font-medium cursor-pointer"
                  >
                    우편번호 찾기
                  </button>
                </div>
                <p v-if="errors.zipCode" class="text-red-500 text-xs mt-1">{{ errors.zipCode }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">주소 *</label>
                <input
                  v-model="formData.address"
                  readonly
                  @click="handleAddressSearch"
                  placeholder="우편번호 찾기를 통해 주소를 입력해주세요"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 cursor-pointer focus:outline-none"
                />
                <p v-if="errors.address" class="text-red-500 text-xs mt-1">{{ errors.address }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">상세 주소</label>
                <input
                  id="addressDetailInput"
                  v-model="formData.addressDetail"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">배송 메모</label>
                <textarea
                  v-model="formData.orderMemo"
                  rows="2"
                  placeholder="배송 시 요청사항을 입력해주세요"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 주문 요약 -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <h2 class="text-lg font-semibold mb-4">주문 요약</h2>
            <div class="space-y-2 text-sm mb-4">
              <div v-for="item in items" :key="item.id" class="flex justify-between">
                <span class="text-gray-600 truncate flex-1 mr-2">{{ item.productName }}</span>
                <span class="shrink-0">
                  {{ (Number(item.discountPrice || item.price || 0) * item.quantity).toLocaleString() }}원
                </span>
              </div>
            </div>
            <div class="border-t pt-3 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-600">상품 금액</span>
                <span>{{ totalPrice.toLocaleString() }}원</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">배송비</span>
                <span>{{ shippingFee === 0 ? '무료' : `${shippingFee.toLocaleString()}원` }}</span>
              </div>
              <div class="border-t pt-2 flex justify-between font-bold text-base">
                <span>총 결제 금액</span>
                <span class="text-indigo-600">{{ finalAmount.toLocaleString() }}원</span>
              </div>
            </div>
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {{ isLoading ? '처리 중...' : `${finalAmount.toLocaleString()}원 결제하기` }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
