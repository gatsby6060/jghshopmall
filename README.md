# ShopMall - 풀스택 쇼핑몰 프로젝트

Java 21, Spring Boot 3.4 기반 백엔드와 **Next.js 15 / Vue.js 3 (Vite) 듀얼 프론트엔드**를 지원하는 현대적인 풀스택 쇼핑몰 애플리케이션입니다.

## 🚀 기술 스택

### Backend
- **Language**: Java 21 (LTS)
- **Framework**: Spring Boot 3.5.0
- **Build Tool**: Gradle 8.x
- **Database**: MariaDB 11.4 (LTS)
- **ORM**: Spring Data JPA (Hibernate 6.6)
- **Security**: Spring Security, JWT, OAuth2 Client

### Frontend 1 (Next.js)
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand, TanStack Query (React Query)
- **Form Handling**: React Hook Form, Zod

### Frontend 2 (Vue.js)
- **Framework**: Vue 3 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router

### Infrastructure
- **Container**: Docker, Docker Compose (Multi-stage Build)

## ✨ 주요 기능

1. **사용자 인증**
   - 이메일 회원가입/로그인 (JWT 기반)
   - 소셜 로그인 (Google, Naver, Kakao, Apple)
2. **상품 및 카테고리**
   - 10개 카테고리 및 카테고리별 10개 이상의 초기 상품 데이터 제공
   - 상품 검색, 정렬, 필터링
   - 추천 상품, 신상품, 베스트 상품 노출
3. **장바구니 및 주문**
   - 장바구니 담기, 수량 변경, 삭제
   - 주문 생성 및 배송지 입력
4. **결제 연동**
   - 토스페이먼츠(Toss Payments) 결제 위젯 연동
5. **마이페이지**
   - 주문 내역 조회
   - 회원 정보 확인
6. **관리자 페이지**
   - 대시보드 (통계)
   - 상품 관리 (등록, 수정, 삭제)
   - 카테고리 관리
   - 주문 상태 관리
   - 회원 권한 관리
7. **기타**
   - 카카오 지도 API 연동 (회사 위치 안내)

## 🛠️ 실행 방법

### 1. 환경 변수 설정
프로젝트 루트 디렉토리의 `.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값을 입력합니다.

```bash
cp .env.example .env
```

### 2. Docker Compose로 실행
모든 서비스(DB, Backend, Frontend)를 한 번에 실행합니다.

```bash
docker-compose up -d --build
```

### 3. 접속 주소
- **Frontend (Next.js)**: http://localhost:4000
- **Frontend (Vue.js)**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **관리자 계정**: `admin@shopmall.com` / `admin123`

## 📁 프로젝트 구조

```
shoppingmall/
├── backend/                # Spring Boot 백엔드
│   ├── src/main/java/...   # 도메인 주도 설계(DDD) 기반 패키지 구조
│   ├── build.gradle        # Gradle 빌드 설정
│   └── Dockerfile          # 백엔드 멀티 스테이지 빌드
├── frontend/               # Next.js 프론트엔드
│   ├── app/                # App Router 페이지 및 레이아웃
│   ├── components/         # 재사용 가능한 UI 컴포넌트
│   ├── lib/                # API 클라이언트 및 유틸리티
│   ├── store/              # Zustand 전역 상태 관리
│   ├── types/              # TypeScript 타입 정의
│   └── Dockerfile          # 프론트엔드 멀티 스테이지 빌드 (Standalone)
├── frontend-vue/           # Vue.js 프론트엔드 (새로 추가됨)
│   ├── src/views/          # 페이지 컴포넌트
│   ├── src/components/     # UI 컴포넌트
│   ├── src/store/          # Pinia 전역 상태 관리
│   ├── src/router/         # Vue Router 설정
│   └── Dockerfile          # Vue.js + Nginx 빌드 및 배포
├── database/
│   └── init/               # MariaDB 초기화 SQL 스크립트
└── docker-compose.yml      # 전체 서비스 컨테이너 오케스트레이션
```

## 📝 개발 지침 준수 사항

- **Java 21 가상 스레드**: 백엔드 Dockerfile에 JVM 최적화 옵션 적용
- **Next.js 15 최적화**: Standalone 모드 빌드로 컨테이너 이미지 크기 최소화
- **JPA 최적화**: 지연 로딩(LAZY) 기본 적용, 운영 환경을 고려한 DDL-AUTO 설정 분리
- **보안**: JWT 기반 무상태(Stateless) 인증, 비밀번호 BCrypt 암호화
