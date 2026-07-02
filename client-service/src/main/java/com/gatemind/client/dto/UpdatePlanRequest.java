package com.gatemind.client.dto;

import com.gatemind.client.entity.enums.Plan;
import lombok.Data;

@Data
public class UpdatePlanRequest {

    private Plan plan;

    public Plan getPlan() {
        return plan;
    }

    public void setPlan(Plan plan) {
        this.plan = plan;
    }
}