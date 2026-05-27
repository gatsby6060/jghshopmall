package com.shoppingmall.backend.domain.admin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "access_logs")
@Getter
@Setter
@NoArgsConstructor
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String ipAddress;

    @Column(nullable = false, length = 255)
    private String uri;

    @Column(nullable = false, length = 10)
    private String method;

    @Column(length = 500)
    private String userAgent;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(length = 50)
    private String country;

    public AccessLog(String ipAddress, String uri, String method, String userAgent, LocalDateTime timestamp, String country) {
        this.ipAddress = ipAddress;
        this.uri = uri;
        this.method = method;
        this.userAgent = userAgent;
        this.timestamp = timestamp;
        this.country = country;
    }
}
