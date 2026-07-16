<script setup lang="ts">
// KakaoMap is omitted for now or we can create a dummy placeholder
</script>

<template>
  <footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 회사 정보 -->
        <div class="md:col-span-2">
          <h3 class="text-white text-xl font-bold mb-4">ShopMall</h3>
          <p class="text-sm leading-relaxed mb-4 whitespace-pre-line">
            당신의 일상을 특별하게 만드는 곳
          </p>
          <div class="text-sm space-y-1">
            <p>상호명: (주)쇼핑몰</p>
            <p>대표자: 홍길동</p>
            <p>사업자등록번호: 123-45-67890</p>
            <p>통신판매업신고: 제2024-서울강남-12345호</p>
            <p>주소: 서울특별시 강남구 테헤란로 123, 쇼핑몰빌딩 10층</p>
            <p>
              고객센터: 1588-1234
              <span class="text-gray-400">(평일 09:00 ~ 18:00)</span>
            </p>
            <p>이메일: support@shopmall.com</p>
          </div>
        </div>

        <!-- 고객 서비스 -->
        <div>
          <h4 class="text-white font-semibold mb-4">고객 서비스</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/about" class="hover:text-white">회사소개</router-link></li>
            <li><router-link to="/faq" class="hover:text-white">자주 묻는 질문</router-link></li>
            <li><router-link to="/notice" class="hover:text-white">공지사항</router-link></li>
            <li><router-link to="/contact" class="hover:text-white">1:1 문의</router-link></li>
            <li><router-link to="/returns" class="hover:text-white">교환/반품 안내</router-link></li>
            <li><router-link to="/shipping" class="hover:text-white">배송 안내</router-link></li>
          </ul>
        </div>

        <!-- 이용 안내 -->
        <div>
          <h4 class="text-white font-semibold mb-4">이용 안내</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/terms" class="hover:text-white">이용약관</router-link></li>
            <li><router-link to="/privacy" class="hover:text-white">개인정보처리방침</router-link></li>
            <li><router-link to="/mypage" class="hover:text-white">마이페이지</router-link></li>
            <li><router-link to="/orders" class="hover:text-white">주문/배송 조회</router-link></li>
          </ul>
        </div>
      </div>

      <!-- 지도 섹션 (임시) -->
      <div class="mt-10 border-t border-gray-700 pt-8">
        <h4 class="text-white font-semibold mb-4">오시는 길</h4>
        <div class="rounded-lg overflow-hidden bg-gray-800 h-64 flex items-center justify-center text-gray-500">
          카카오맵 영역 (추후 구현)
        </div>
      </div>

      <!-- 저작권 -->
      <div class="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        <p>© 2024 ShopMall. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
