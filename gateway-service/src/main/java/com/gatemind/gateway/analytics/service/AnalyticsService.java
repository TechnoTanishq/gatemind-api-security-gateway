package com.gatemind.gateway.analytics.service;

import com.gatemind.gateway.analytics.dto.*;
import com.gatemind.gateway.analytics.entity.SecurityEvent;
import com.gatemind.gateway.analytics.enums.EventType;
import com.gatemind.gateway.analytics.repository.SecurityEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final SecurityEventRepository repository;

    public DashboardStatsResponse getDashboardStats() {

        return new DashboardStatsResponse(

                repository.countByBlockedTrue(),

                repository.countByTimestampAfter(
                        Instant.now().minus(1, ChronoUnit.DAYS)
                ),

                repository.countByEventType(EventType.SQL_INJECTION),

                repository.countByEventType(EventType.XSS),

                repository.countByEventType(EventType.PATH_TRAVERSAL),

                repository.countByEventType(EventType.COMMAND_INJECTION)

        );
    }

    public List<RecentThreatResponse> recentThreats() {

        return repository.findByBlockedTrueOrderByTimestampDesc(
                        PageRequest.of(0,20)
                )
                .stream()
                .map(event -> RecentThreatResponse.builder()

                        .timestamp(event.getTimestamp())

                        .companyName(event.getCompanyName())

                        .eventType(event.getEventType().name())

                        .path(event.getPath())

                        .ipAddress(event.getIpAddress())

                        .reason(event.getReason())

                        .build())

                .toList();

    }

    public List<TopThreatResponse> topThreats(){
        return repository.topThreats()
                .stream()
                .map(row -> new TopThreatResponse(
                        row[0] != null ? row[0].toString() : "UNKNOWN",
                        (Long) row[1]
                ))
                .toList();
    }

    public List<TopClientResponse> topClients(){
        return repository.topClients()
                .stream()
                .map(row -> new TopClientResponse(
                        row[0] != null ? row[0].toString() : "Unknown",
                        (Long) row[1]
                ))
                .toList();
    }

    public List<TopIpResponse> topIps(){
        return repository.topIps()
                .stream()
                .map(row -> new TopIpResponse(
                        row[0] != null ? row[0].toString() : "Unknown",
                        (Long) row[1]
                ))
                .toList();
    }

    public List<AttackTrendResponse> attackTrend(){

        return repository.attackTrend()

                .stream()

                .map(row->new AttackTrendResponse(

                        ((java.sql.Date)row[0]).toLocalDate(),

                        ((Number)row[1]).longValue()

                ))

                .toList();

    }

}