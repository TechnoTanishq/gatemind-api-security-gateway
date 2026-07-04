package com.gatemind.gateway.analytics.repository;

import com.gatemind.gateway.analytics.entity.SecurityEvent;
import com.gatemind.gateway.analytics.enums.EventType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {

    long countByBlockedTrue();

    long countByTimestampAfter(Instant instant);

    long countByEventType(EventType type);

    // Per-client queries
    long countByClientIdAndBlockedTrue(Long clientId);

    long countByClientIdAndTimestampAfter(Long clientId, Instant instant);

    List<SecurityEvent> findByClientIdAndBlockedTrueOrderByTimestampDesc(Long clientId, Pageable pageable);

    @Query("""
            SELECT e.eventType, COUNT(e)
            FROM SecurityEvent e
            WHERE e.clientId = :clientId
            GROUP BY e.eventType
            ORDER BY COUNT(e) DESC
            """)
    List<Object[]> topThreatsByClient(Long clientId);

    @Query(value = """
            SELECT DATE(timestamp), COUNT(*)
            FROM security_events
            WHERE client_id = :clientId
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp)
            """, nativeQuery = true)
    List<Object[]> attackTrendByClient(Long clientId);

    List<SecurityEvent> findByBlockedTrueOrderByTimestampDesc(Pageable pageable);

    @Query("""
            SELECT e.eventType, COUNT(e)
            FROM SecurityEvent e
            GROUP BY e.eventType
            ORDER BY COUNT(e) DESC
            """)
    List<Object[]> topThreats();

    @Query("""
            SELECT e.companyName, COUNT(e)
            FROM SecurityEvent e
            GROUP BY e.companyName
            ORDER BY COUNT(e) DESC
            """)
    List<Object[]> topClients();

    @Query(value = """
            SELECT DATE(timestamp), COUNT(*)
            FROM security_events
            GROUP BY DATE(timestamp)
            ORDER BY DATE(timestamp)
            """, nativeQuery = true)
    List<Object[]> attackTrend();

    @Query("""
            SELECT e.ipAddress, COUNT(e)
            FROM SecurityEvent e
            GROUP BY e.ipAddress
            ORDER BY COUNT(e) DESC
            """)
    List<Object[]> topIps();

}