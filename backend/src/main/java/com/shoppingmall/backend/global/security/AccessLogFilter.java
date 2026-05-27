package com.shoppingmall.backend.global.security;

import com.shoppingmall.backend.domain.admin.entity.AccessLog;
import com.shoppingmall.backend.domain.admin.repository.AccessLogRepository;
import com.shoppingmall.backend.domain.admin.repository.BlockedIpRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccessLogFilter extends OncePerRequestFilter {

    private final AccessLogRepository accessLogRepository;
    private final BlockedIpRepository blockedIpRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String ipAddress = getClientIp(request);

        // IP 차단 여부 검사
        if (blockedIpRepository.existsByIpAddress(ipAddress)) {
            log.warn("Blocked request attempt from IP: {}", ipAddress);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json; charset=utf-8");
            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"해당 IP는 관리자에 의해 접속이 차단되었습니다. (Your IP has been blocked by administrator)\"}");
            return;
        }

        String uri = request.getRequestURI();
        
        // 정적 자원이나 건강 진단 API는 로그에서 제외
        if (uri.startsWith("/actuator") || uri.endsWith(".png") || uri.endsWith(".jpg") || uri.endsWith(".ico")) {
            filterChain.doFilter(request, response);
            return;
        }

        String method = request.getMethod();
        String userAgent = request.getHeader("User-Agent");
        
        // IP에 따른 국가 간이 분석 (로컬/중국/미국/한국 등 예시 매핑)
        String country = resolveCountrySimple(ipAddress);

        try {
            AccessLog accessLog = new AccessLog(ipAddress, uri, method, userAgent, LocalDateTime.now(), country);
            accessLogRepository.save(accessLog);
        } catch (Exception e) {
            log.error("Failed to save access log", e);
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        
        // X-Forwarded-For에 여러 IP가 포함된 경우 첫 번째가 실제 클라이언트 IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        
        // IPv6 로컬호스트 처리
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }
        
        return ip;
    }

    private String resolveCountrySimple(String ip) {
        if (ip == null) return "Unknown";
        if (ip.equals("127.0.0.1") || ip.startsWith("192.168.") || ip.startsWith("10.")) {
            return "Local/Private";
        }
        
        // 대표적인 중국 대역 예시 매핑 (테스트 목적)
        if (ip.startsWith("222.128.") || ip.startsWith("1.202.") || ip.startsWith("114.244.") || ip.startsWith("106.120.") || ip.startsWith("220.181.")) {
            return "China";
        }
        
        // 대표적인 미국 대역 예시 매핑
        if (ip.startsWith("8.8.") || ip.startsWith("9.9.") || ip.startsWith("104.244.") || ip.startsWith("34.120.")) {
            return "United States";
        }

        // 한국 대역 예시 매핑
        if (ip.startsWith("14.52.") || ip.startsWith("210.123.") || ip.startsWith("121.130.") || ip.startsWith("211.234.")) {
            return "South Korea";
        }
        
        return "Unknown";
    }
}
