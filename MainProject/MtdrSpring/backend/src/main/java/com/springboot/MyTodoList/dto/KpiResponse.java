package com.springboot.MyTodoList.dto;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;

public class KpiResponse {

    @JsonProperty("compliance_rate")
    private Map<String, List<Map<String, Object>>> complianceRate;

    @JsonProperty("estimation_precision")
    private Map<String, List<Map<String, Object>>> estimationPrecision;

    public KpiResponse(Map<String, List<Map<String, Object>>> complianceRate,
                       Map<String, List<Map<String, Object>>> estimationPrecision) {
        this.complianceRate = complianceRate;
        this.estimationPrecision = estimationPrecision;
    }

    public Map<String, List<Map<String, Object>>> getComplianceRate() {
        return complianceRate;
    }

    public void setComplianceRate(Map<String, List<Map<String, Object>>> complianceRate) {
        this.complianceRate = complianceRate;
    }

    public Map<String, List<Map<String, Object>>> getEstimationPrecision() {
        return estimationPrecision;
    }

    public void setEstimationPrecision(Map<String, List<Map<String, Object>>> estimationPrecision) {
        this.estimationPrecision = estimationPrecision;
    }
}