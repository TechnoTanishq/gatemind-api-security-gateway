package com.gatemind.gateway.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ClientStatsResponse {

    private long totalBlocked;        // all-time blocked requests for this client
    private long blockedToday;        // blocked in last 24h
    private List<TopThreatResponse>  topThreats;   // breakdown by threat type
    private List<AttackTrendResponse> attackTrend;  // daily trend
    private List<RecentThreatResponse> recentThreats; // last 10 blocked requests
}
