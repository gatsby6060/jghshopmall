# ===== 빌드 스테이지 =====
FROM gradle:8-jdk21 AS builder

WORKDIR /app

# Gradle Wrapper 및 빌드 파일 먼저 복사 (레이어 캐싱 최적화)
COPY gradlew gradlew.bat settings.gradle build.gradle ./
COPY gradle ./gradle

# 실행 권한 부여
RUN chmod +x gradlew

# 의존성 다운로드 (소스 변경 시 재다운로드 방지)
RUN ./gradlew dependencies --no-daemon -q 2>/dev/null || true

# 소스 코드 복사 및 빌드 (테스트 제외)
COPY src ./src
RUN ./gradlew bootJar --no-daemon -x test -q

# ===== 실행 스테이지 =====
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 보안: non-root 사용자
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 빌드 결과물 복사
COPY --from=builder /app/build/libs/*.jar app.jar
RUN chown appuser:appgroup app.jar

USER appuser

EXPOSE 8080

# JVM 최적화 (컨테이너 메모리 인식, Java 21 가상 스레드 지원)
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
