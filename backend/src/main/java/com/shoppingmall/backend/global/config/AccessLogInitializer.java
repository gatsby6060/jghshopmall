package com.shoppingmall.backend.global.config;

import com.shoppingmall.backend.domain.admin.entity.AccessLog;
import com.shoppingmall.backend.domain.admin.repository.AccessLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AccessLogInitializer implements CommandLineRunner {

    private final AccessLogRepository accessLogRepository;

    @Override
    public void run(String... args) throws Exception {
        if (accessLogRepository.count() == 0) {
            log.info("Initializing mock access logs for IP monitoring demo...");

            List<AccessLog> mockLogs = List.of(
                new AccessLog("222.128.10.45", "/api/products", "GET", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0", LocalDateTime.now().minusMinutes(5), "China"),
                new AccessLog("14.52.4.92", "/api/cart", "POST", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) Mobile/15E148", LocalDateTime.now().minusMinutes(12), "South Korea"),
                new AccessLog("8.8.8.8", "/api/products/1", "GET", "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", LocalDateTime.now().minusMinutes(45), "United States"),
                new AccessLog("1.202.19.102", "/api/auth/login", "POST", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15", LocalDateTime.now().minusHours(2), "China"),
                new AccessLog("127.0.0.1", "/api/admin/dashboard", "GET", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0", LocalDateTime.now().minusHours(3), "Local/Private"),
                new AccessLog("114.244.92.51", "/api/products?page=1", "GET", "Mozilla/5.0 (Linux; Android 10; K) Chrome/120.0.0.0 Mobile", LocalDateTime.now().minusHours(5), "China"),
                new AccessLog("211.234.12.84", "/api/orders", "POST", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0", LocalDateTime.now().minusHours(7), "South Korea"),
                new AccessLog("104.244.42.1", "/api/categories", "GET", "Mozilla/5.0 (compatible; Yahoo! Slurp; http://help.yahoo.com/help/us/ysearch/slurp)", LocalDateTime.now().minusHours(12), "United States"),
                new AccessLog("222.128.45.19", "/api/products/3", "GET", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0", LocalDateTime.now().minusDays(1), "China"),
                new AccessLog("14.52.231.8", "/api/auth/signup", "POST", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15", LocalDateTime.now().minusDays(1).minusHours(4), "South Korea")
            );

            accessLogRepository.saveAll(mockLogs);
            log.info("Successfully loaded 10 mock access logs!");
        }
    }
}
