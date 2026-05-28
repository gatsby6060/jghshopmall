package com.shoppingmall.backend.global.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Slf4j
@RestController
@RequestMapping("/api/test/kafka")
@RequiredArgsConstructor
public class PaymentTestController {

    private final PaymentEventProducer paymentEventProducer;
    private final ExecutorService executorService = Executors.newSingleThreadExecutor();

    @GetMapping("/waterfall")
    public ResponseEntity<Map<String, String>> startWaterfallTest() {
        log.info(" [Kafka Stress Test 🌊] 데이터 폭포 스트레스 테스트 요청 수신 (초당 30건씩 10초간 -> 총 300건 발송)");
        
        executorService.submit(() -> {
            int totalMessages = 300;
            int ratePerSecond = 30;
            int delayMs = 1000 / ratePerSecond; // 약 33ms 딜레이
            
            log.info(" [Kafka Stress Test 🌊] 비동기 데이터 폭포 발송 시작...");
            
            for (int i = 1; i <= totalMessages; i++) {
                String testOrderId = "STRESS-ORDER-" + String.format("%03d", i) + "-" + (System.currentTimeMillis() % 10000);
                Long testAmount = 10000L + (i * 100);
                String testEmail = "stress-user-" + i + "@example.com";
                
                paymentEventProducer.sendPaymentEvent(testOrderId, testAmount, testEmail);
                
                try {
                    Thread.sleep(delayMs);
                } catch (InterruptedException e) {
                    log.error("스트레스 테스트 발송 중 인터럽트 발생: ", e);
                    Thread.currentThread().interrupt();
                    break;
                }
            }
            log.info(" [Kafka Stress Test 🌊] 총 300개 데이터 폭포 발송 완료!");
        });

        return ResponseEntity.ok(Map.of(
                "status", "STARTED",
                "message", "데이터 폭포 스트레스 테스트가 시작되었습니다. (초당 30건씩 10초간 -> 총 300건 비동기 발송)"
        ));
    }
}
