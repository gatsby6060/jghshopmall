# ===== 1단계: 빌드 =====
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package.json package-lock.json* ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# ===== 2단계: 실행 (Nginx) =====
FROM nginx:alpine AS runner

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
