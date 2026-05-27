package com.shoppingmall.backend.domain.admin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_ips")
@Getter
@Setter
@NoArgsConstructor
public class BlockedIp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String ipAddress;

    @Column(length = 255)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime blockedAt;

    public BlockedIp(String ipAddress, String reason, LocalDateTime blockedAt) {
        this.ipAddress = ipAddress;
        this.reason = reason;
        this.blockedAt = blockedAt;
    }
}
