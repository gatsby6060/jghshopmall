package com.shoppingmall.backend.domain.admin.repository;

import com.shoppingmall.backend.domain.admin.entity.AccessLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccessLogRepository extends JpaRepository<AccessLog, Long> {
    Page<AccessLog> findAllByOrderByTimestampDesc(Pageable pageable);
}
