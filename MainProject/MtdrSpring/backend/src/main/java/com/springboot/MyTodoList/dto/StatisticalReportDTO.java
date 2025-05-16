package com.springboot.MyTodoList.dto;

import java.util.List;
import java.util.Map;

/**
 * Data Transfer Object for AI-ready statistical reports based on sprint and project data
 */
public class StatisticalReportDTO {
    
    private Map<String, Object> summaryMetrics;
    private List<Map<String, Object>> sprintPerformance;
    private List<Map<String, Object>> userPerformance;
    private List<Map<String, Object>> projectProgress;
    private List<Map<String, Object>> teamProductivity;
    private Map<String, Object> trendsAnalysis;
    
    // Default constructor
    public StatisticalReportDTO() {
    }
    
    // Parameterized constructor
    public StatisticalReportDTO(Map<String, Object> summaryMetrics, 
                               List<Map<String, Object>> sprintPerformance,
                               List<Map<String, Object>> userPerformance,
                               List<Map<String, Object>> projectProgress,
                               List<Map<String, Object>> teamProductivity,
                               Map<String, Object> trendsAnalysis) {
        this.summaryMetrics = summaryMetrics;
        this.sprintPerformance = sprintPerformance;
        this.userPerformance = userPerformance;
        this.projectProgress = projectProgress;
        this.teamProductivity = teamProductivity;
        this.trendsAnalysis = trendsAnalysis;
    }
    
    // Getters and Setters
    public Map<String, Object> getSummaryMetrics() {
        return summaryMetrics;
    }
    
    public void setSummaryMetrics(Map<String, Object> summaryMetrics) {
        this.summaryMetrics = summaryMetrics;
    }
    
    public List<Map<String, Object>> getSprintPerformance() {
        return sprintPerformance;
    }
    
    public void setSprintPerformance(List<Map<String, Object>> sprintPerformance) {
        this.sprintPerformance = sprintPerformance;
    }
    
    public List<Map<String, Object>> getUserPerformance() {
        return userPerformance;
    }
    
    public void setUserPerformance(List<Map<String, Object>> userPerformance) {
        this.userPerformance = userPerformance;
    }
    
    public List<Map<String, Object>> getProjectProgress() {
        return projectProgress;
    }
    
    public void setProjectProgress(List<Map<String, Object>> projectProgress) {
        this.projectProgress = projectProgress;
    }
    
    public List<Map<String, Object>> getTeamProductivity() {
        return teamProductivity;
    }
    
    public void setTeamProductivity(List<Map<String, Object>> teamProductivity) {
        this.teamProductivity = teamProductivity;
    }
    
    public Map<String, Object> getTrendsAnalysis() {
        return trendsAnalysis;
    }
    
    public void setTrendsAnalysis(Map<String, Object> trendsAnalysis) {
        this.trendsAnalysis = trendsAnalysis;
    }
} 