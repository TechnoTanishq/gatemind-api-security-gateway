package com.gatemind.gateway.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AttackTrendResponse {

    private LocalDate date;
    private Long attacks;

}