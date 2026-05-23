# ===== 1단계: 의존성 설치 =====
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# ===== 2단계: 빌드 =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 빌드 시 주입되는 환경변수 (NEXT_PUBLIC_* 는 빌드 타임에 번들에 포함됨)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ARG NEXT_PUBLIC_KAKAO_MAP_API_KEY=dummy
ARG NEXT_PUBLIC_PORTONE_STORE_CODE=imp19421636
ARG NEXT_PUBLIC_PORTONE_CHANNEL_KEY=dummy

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_KAKAO_MAP_API_KEY=$NEXT_PUBLIC_KAKAO_MAP_API_KEY
ENV NEXT_PUBLIC_PORTONE_STORE_CODE=$NEXT_PUBLIC_PORTONE_STORE_CODE
ENV NEXT_PUBLIC_PORTONE_CHANNEL_KEY=$NEXT_PUBLIC_PORTONE_CHANNEL_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ===== 3단계: 실행 (Standalone 모드 - 최소 이미지) =====
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 보안: non-root 사용자
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# standalone 빌드 결과물만 복사 (이미지 크기 최소화)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
