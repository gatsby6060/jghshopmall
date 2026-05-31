package com.shoppingmall.backend.global.config;

import com.shoppingmall.backend.domain.product.service.ProductService;
import com.shoppingmall.backend.domain.product.repository.ProductDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ElasticsearchIndexInitializer implements CommandLineRunner {

    private final ProductService productService;
    private final ProductDocumentRepository productDocumentRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            long count = productDocumentRepository.count();
            if (count == 0) {
                log.info("Elasticsearch product index is empty. Triggering automatic full reindexing...");
                productService.reindexAll();
                log.info("Successfully finished automatic full reindexing of products!");
            } else {
                log.info("Elasticsearch product index has {} existing documents. Skipping automatic reindexing.", count);
            }
        } catch (Exception e) {
            log.error("Failed to perform automatic Elasticsearch reindexing check", e);
        }
    }
}
