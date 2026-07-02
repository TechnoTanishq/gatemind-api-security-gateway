package com.gatemind.gateway.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {

    private long totalBlocked;

    private long todayBlocked;

    private long sqlInjection;

    private long xss;

    private long pathTraversal;

    private long commandInjection;

}