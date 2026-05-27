package com.shoppingmall.backend.domain.admin.repository;

import com.shoppingmall.backend.domain.admin.entity.BlockedIp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BlockedIpRepository extends JpaRepository<BlockedIp, Long> {
    boolean existsByIpAddress(String ipAddress);
    Optional<BlockedIp> findByIpAddress(String ipAddress);
}
