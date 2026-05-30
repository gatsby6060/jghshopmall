package com.shoppingmall.backend.domain.product.repository;

import com.shoppingmall.backend.domain.product.document.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDocumentRepository extends ElasticsearchRepository<ProductDocument, Long> {

    @Query("{\"bool\": {\"must\": [{\"multi_match\": {\"query\": \"?0\", \"fields\": [\"name^2\", \"description\"], \"fuzziness\": \"AUTO\"}}], \"filter\": [{\"term\": {\"status\": \"ACTIVE\"}}]}}")
    Page<ProductDocument> searchFuzzy(String keyword, Pageable pageable);

    @Query("{\"bool\": {\"must\": [{\"match_phrase_prefix\": {\"name\": \"?0\"}}], \"filter\": [{\"term\": {\"status\": \"ACTIVE\"}}]}}")
    List<ProductDocument> findByNamePrefix(String prefix, Pageable pageable);
}
