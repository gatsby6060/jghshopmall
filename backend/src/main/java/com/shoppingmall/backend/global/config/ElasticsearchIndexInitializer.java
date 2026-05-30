package com.shoppingmall.backend.global.config;

import com.shoppingmall.backend.domain.product.document.ProductDocument;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.repository.ProductDocumentRepository;
import com.shoppingmall.backend.domain.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ElasticsearchIndexInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductDocumentRepository productDocumentRepository;

    @Override
    public void run(String... args) {
        try {
            long count = productDocumentRepository.count();
            if (count == 0) {
                log.info("Elasticsearch product index is empty. Starting initial reindexing from database...");
                List<Product> activeProducts = productRepository.findByStatus(Product.ProductStatus.ACTIVE, org.springframework.data.domain.Pageable.unpaged()).getContent();
                if (!activeProducts.isEmpty()) {
                    List<ProductDocument> docs = activeProducts.stream()
                            .map(ProductDocument::from)
                            .collect(Collectors.toList());
                    productDocumentRepository.saveAll(docs);
                    log.info("Successfully indexed {} active products to Elasticsearch.", docs.size());
                } else {
                    log.info("No active products found in database for indexing.");
                }
            } else {
                log.info("Elasticsearch product index already contains {} documents. Skipping initial indexing.", count);
            }
        } catch (Exception e) {
            log.error("Failed to run Elasticsearch startup index initialization. (Elasticsearch might be offline)", e);
        }
    }
}
