package com.shoppingmall.backend.domain.product.listener;

import com.shoppingmall.backend.domain.product.document.ProductDocument;
import com.shoppingmall.backend.domain.product.entity.Product;
import com.shoppingmall.backend.domain.product.repository.ProductDocumentRepository;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProductEntityListener {

    private static ProductDocumentRepository productDocumentRepository;

    @Autowired
    public void init(@Lazy ProductDocumentRepository repository) {
        ProductEntityListener.productDocumentRepository = repository;
    }

    @PostPersist
    @PostUpdate
    public void onPostPersistOrUpdate(Product product) {
        if (productDocumentRepository != null && product.getStatus() == Product.ProductStatus.ACTIVE) {
            try {
                productDocumentRepository.save(ProductDocument.from(product));
                log.info("Successfully synced Product ID {} to Elasticsearch", product.getId());
            } catch (Exception e) {
                log.error("Failed to sync Product ID {} to Elasticsearch", product.getId(), e);
            }
        } else if (productDocumentRepository != null) {
            try {
                productDocumentRepository.deleteById(product.getId());
                log.info("Deleted Product ID {} from Elasticsearch due to status change", product.getId());
            } catch (Exception e) {
                log.error("Failed to delete Product ID {} from Elasticsearch", product.getId(), e);
            }
        }
    }

    @PostRemove
    public void onPostRemove(Product product) {
        if (productDocumentRepository != null) {
            try {
                productDocumentRepository.deleteById(product.getId());
                log.info("Successfully deleted Product ID {} from Elasticsearch", product.getId());
            } catch (Exception e) {
                log.error("Failed to delete Product ID {} from Elasticsearch", product.getId(), e);
            }
        }
    }
}
