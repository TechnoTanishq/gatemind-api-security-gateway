package com.gatemind.gateway.analytics.controller;

import com.gatemind.gateway.analytics.dto.*;
import com.gatemind.gateway.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/stats")
    public DashboardStatsResponse stats() {
        return analyticsService.getDashboardStats();
    }

    @GetMapping("/recent")
    public List<RecentThreatResponse> recent() {
        return analyticsService.recentThreats();
    }

    @GetMapping("/top-threats")
    public List<TopThreatResponse> topThreats() {
        return analyticsService.topThreats();
    }

    @GetMapping("/top-clients")
    public List<TopClientResponse> topClients() {
        return analyticsService.topClients();
    }

    @GetMapping("/top-ips")
    public List<TopIpResponse> topIps() {
        return analyticsService.topIps();
    }

    @GetMapping("/attack-trend")
    public List<AttackTrendResponse> attackTrend() {
        return analyticsService.attackTrend();
    }

    // Per-client stats — called from the client portal with ?clientId=X
    @GetMapping("/client-stats")
    public ClientStatsResponse clientStats(@RequestParam Long clientId) {
        return analyticsService.getClientStats(clientId);
    }
}