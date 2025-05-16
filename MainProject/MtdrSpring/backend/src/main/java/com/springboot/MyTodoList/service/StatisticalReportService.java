package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.KpiResponse;
import com.springboot.MyTodoList.dto.StatisticalReportDTO;
import com.springboot.MyTodoList.repository.TaskRepository;
import com.springboot.MyTodoList.repository.SprintRepository;
import com.springboot.MyTodoList.repository.ProjectRepository;
import com.springboot.MyTodoList.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Service for generating statistical reports that can be fed into an LLM for AI managerial suggestions
 */
@Service
public class StatisticalReportService {

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private TaskService taskService;
    
    @Autowired
    private SprintRepository sprintRepository;
    
    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UsersRepository userRepository;
    
    /**
     * Generates a comprehensive statistical report for all projects, sprints, and users
     * @return A structured DTO for AI consumption
     */
    public StatisticalReportDTO generateComprehensiveReport() {
        String currentDate = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        // Get KPI data using existing service
        KpiResponse kpiResponse = taskService.getComplianceRateKpis(currentDate);
        
        // Process and generate the statistical report
        Map<String, Object> summaryMetrics = generateSummaryMetrics(kpiResponse);
        List<Map<String, Object>> sprintPerformance = processSprintPerformance(kpiResponse);
        List<Map<String, Object>> userPerformance = processUserPerformance(kpiResponse);
        List<Map<String, Object>> projectProgress = processProjectProgress(kpiResponse);
        List<Map<String, Object>> teamProductivity = processTeamProductivity();
        Map<String, Object> trendsAnalysis = analyzeTrends(kpiResponse);
        
        return new StatisticalReportDTO(
                summaryMetrics,
                sprintPerformance,
                userPerformance,
                projectProgress,
                teamProductivity,
                trendsAnalysis
        );
    }
    
    /**
     * Generates a statistical report focused on a specific project
     * @param projectId The ID of the project to analyze
     * @return A structured DTO for AI consumption
     */
    public StatisticalReportDTO generateProjectReport(int projectId) {
        String currentDate = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        // Collect data specific to the project
        // Project-specific implementation would go here
        
        // For demonstration purposes, we'll use the comprehensive report with filtering
        StatisticalReportDTO fullReport = generateComprehensiveReport();
        
        // Filter data for just this project
        Map<String, Object> summaryMetrics = new HashMap<>();
        // Add project-specific metrics here
        
        return fullReport; // For now, return the full report. This would be project-filtered in a production implementation
    }
    
    /**
     * Generates a statistical report focused on a specific sprint
     * @param sprintId The ID of the sprint to analyze
     * @return A structured DTO for AI consumption
     */
    public StatisticalReportDTO generateSprintReport(int sprintId) {
        String currentDate = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        // Get KPI data for this specific sprint
        KpiResponse kpiResponse = taskService.getKpisBySprintId(sprintId, currentDate);
        
        // Process data for this specific sprint
        Map<String, Object> summaryMetrics = generateSprintSummaryMetrics(kpiResponse, sprintId);
        List<Map<String, Object>> sprintPerformance = processSprintPerformance(kpiResponse);
        List<Map<String, Object>> userPerformance = processUserPerformanceForSprint(sprintId);
        Map<String, Object> trendsAnalysis = new HashMap<>(); // Sprint-specific trends would go here
        
        return new StatisticalReportDTO(
                summaryMetrics,
                sprintPerformance,
                userPerformance,
                new ArrayList<>(), // Project progress not relevant for sprint report
                new ArrayList<>(), // Team productivity not relevant for sprint report
                trendsAnalysis
        );
    }
    
    // Private helper methods for data processing
    
    private Map<String, Object> generateSummaryMetrics(KpiResponse kpiResponse) {
        Map<String, Object> summaryMetrics = new HashMap<>();
        
        // Calculate overall metrics from projects data
        List<Map<String, Object>> projects = kpiResponse.getComplianceRate().get("projects");
        if (projects != null && !projects.isEmpty()) {
            double avgComplianceRate = calculateAverage(projects, "tasa_cumplimiento");
            int totalCompletedTasks = calculateSum(projects, "tareas_completadas");
            int totalOnTimeTasks = calculateSum(projects, "tareas_a_tiempo");
            
            summaryMetrics.put("average_compliance_rate", Math.round(avgComplianceRate * 100.0) / 100.0);
            summaryMetrics.put("total_completed_tasks", totalCompletedTasks);
            summaryMetrics.put("total_on_time_tasks", totalOnTimeTasks);
            summaryMetrics.put("on_time_percentage", totalCompletedTasks > 0 ? 
                    Math.round((double)totalOnTimeTasks / totalCompletedTasks * 10000.0) / 100.0 : 0);
        }
        
        // Add estimation precision metrics
        List<Map<String, Object>> projectsPrecision = kpiResponse.getEstimationPrecision().get("projects");
        if (projectsPrecision != null && !projectsPrecision.isEmpty()) {
            double avgHourDeviation = calculateAverage(projectsPrecision, "desviacion_promedio_horas");
            double avgDayDeviation = calculateAverage(projectsPrecision, "desviacion_promedio_dias");
            
            summaryMetrics.put("average_hour_deviation", Math.round(avgHourDeviation * 100.0) / 100.0);
            summaryMetrics.put("average_day_deviation", Math.round(avgDayDeviation * 100.0) / 100.0);
        }
        
        return summaryMetrics;
    }
    
    private Map<String, Object> generateSprintSummaryMetrics(KpiResponse kpiResponse, int sprintId) {
        Map<String, Object> summaryMetrics = new HashMap<>();
        
        // Extract data for the specific sprint
        List<Map<String, Object>> sprints = kpiResponse.getComplianceRate().get("sprints");
        if (sprints != null && !sprints.isEmpty()) {
            // Find the sprint with matching ID
            Optional<Map<String, Object>> sprintData = sprints.stream()
                    .filter(sprint -> ((Number)sprint.get("id")).intValue() == sprintId)
                    .findFirst();
            
            sprintData.ifPresent(sprint -> {
                summaryMetrics.put("sprint_id", sprint.get("id"));
                summaryMetrics.put("sprint_name", sprint.get("name"));
                summaryMetrics.put("compliance_rate", sprint.get("tasa_cumplimiento"));
                summaryMetrics.put("completed_tasks", sprint.get("tareas_completadas"));
                summaryMetrics.put("on_time_tasks", sprint.get("tareas_a_tiempo"));
                summaryMetrics.put("in_progress_tasks", sprint.get("tareas_en_progreso"));
                summaryMetrics.put("to_do_tasks", sprint.get("tareas_por_hacer"));
            });
        }
        
        // Add estimation precision metrics
        List<Map<String, Object>> sprintsPrecision = kpiResponse.getEstimationPrecision().get("sprints");
        if (sprintsPrecision != null && !sprintsPrecision.isEmpty()) {
            // Find the sprint with matching ID
            Optional<Map<String, Object>> sprintPrecision = sprintsPrecision.stream()
                    .filter(sprint -> ((Number)sprint.get("id")).intValue() == sprintId)
                    .findFirst();
            
            sprintPrecision.ifPresent(sprint -> {
                summaryMetrics.put("hour_deviation", sprint.get("desviacion_promedio_horas"));
                summaryMetrics.put("day_deviation", sprint.get("desviacion_promedio_dias"));
            });
        }
        
        return summaryMetrics;
    }
    
    private List<Map<String, Object>> processSprintPerformance(KpiResponse kpiResponse) {
        List<Map<String, Object>> sprintPerformance = new ArrayList<>();
        
        List<Map<String, Object>> sprints = kpiResponse.getComplianceRate().get("sprints");
        List<Map<String, Object>> sprintsPrecision = kpiResponse.getEstimationPrecision().get("sprints");
        
        if (sprints != null) {
            for (Map<String, Object> sprint : sprints) {
                Map<String, Object> sprintData = new HashMap<>(sprint);
                
                // Add estimation precision data if available
                if (sprintsPrecision != null) {
                    int sprintId = ((Number)sprint.get("id")).intValue();
                    
                    Optional<Map<String, Object>> sprintPrecision = sprintsPrecision.stream()
                            .filter(s -> ((Number)s.get("id")).intValue() == sprintId)
                            .findFirst();
                    
                    sprintPrecision.ifPresent(precisionData -> {
                        sprintData.put("hour_deviation", precisionData.get("desviacion_promedio_horas"));
                        sprintData.put("day_deviation", precisionData.get("desviacion_promedio_dias"));
                    });
                }
                
                sprintPerformance.add(sprintData);
            }
        }
        
        return sprintPerformance;
    }
    
    private List<Map<String, Object>> processUserPerformance(KpiResponse kpiResponse) {
        List<Map<String, Object>> userPerformance = new ArrayList<>();
        
        List<Map<String, Object>> users = kpiResponse.getComplianceRate().get("users");
        List<Map<String, Object>> usersPrecision = kpiResponse.getEstimationPrecision().get("users");
        
        if (users != null) {
            for (Map<String, Object> user : users) {
                Map<String, Object> userData = new HashMap<>(user);
                
                // Add estimation precision data if available
                if (usersPrecision != null) {
                    int userId = ((Number)user.get("id")).intValue();
                    
                    Optional<Map<String, Object>> userPrecision = usersPrecision.stream()
                            .filter(u -> ((Number)u.get("id")).intValue() == userId)
                            .findFirst();
                    
                    userPrecision.ifPresent(precisionData -> {
                        userData.put("hour_deviation", precisionData.get("desviacion_promedio_horas"));
                        userData.put("day_deviation", precisionData.get("desviacion_promedio_dias"));
                    });
                }
                
                userPerformance.add(userData);
            }
        }
        
        return userPerformance;
    }
    
    private List<Map<String, Object>> processUserPerformanceForSprint(int sprintId) {
        // Get combined performance data per user for this sprint
        List<Map<String, Object>> sprintUserData = taskRepository.getComplianceRateBySprintAndUser();
        List<Map<String, Object>> userPrecisionData = taskRepository.getEstimationPrecisionBySprintAndUser();
        
        List<Map<String, Object>> userPerformance = new ArrayList<>();
        
        // Filter data for this sprint and combine
        if (sprintUserData != null) {
            for (Map<String, Object> userData : sprintUserData) {
                if (((Number)userData.get("sprintId")).intValue() == sprintId) {
                    Map<String, Object> userInfo = new HashMap<>();
                    userInfo.put("user_id", userData.get("userId"));
                    userInfo.put("user_name", userData.get("userName"));
                    userInfo.put("compliance_rate", userData.get("tasa_cumplimiento"));
                    userInfo.put("completed_tasks", userData.get("tareas_completadas"));
                    userInfo.put("on_time_tasks", userData.get("tareas_a_tiempo"));
                    userInfo.put("in_progress_tasks", userData.get("tareas_en_progreso"));
                    userInfo.put("to_do_tasks", userData.get("tareas_por_hacer"));
                    
                    // Add precision data if available
                    int userId = ((Number)userData.get("userId")).intValue();
                    
                    if (userPrecisionData != null) {
                        Optional<Map<String, Object>> precisionData = userPrecisionData.stream()
                                .filter(data -> 
                                        ((Number)data.get("sprintId")).intValue() == sprintId && 
                                        ((Number)data.get("userId")).intValue() == userId)
                                .findFirst();
                        
                        precisionData.ifPresent(precision -> {
                            userInfo.put("hour_deviation", precision.get("desviacion_promedio_horas"));
                            userInfo.put("day_deviation", precision.get("desviacion_promedio_dias"));
                            userInfo.put("estimated_hours", precision.get("horas_estimadas"));
                            userInfo.put("real_hours", precision.get("horas_reales"));
                        });
                    }
                    
                    userPerformance.add(userInfo);
                }
            }
        }
        
        return userPerformance;
    }
    
    private List<Map<String, Object>> processProjectProgress(KpiResponse kpiResponse) {
        List<Map<String, Object>> projectProgress = new ArrayList<>();
        
        List<Map<String, Object>> projects = kpiResponse.getComplianceRate().get("projects");
        List<Map<String, Object>> projectsPrecision = kpiResponse.getEstimationPrecision().get("projects");
        
        if (projects != null) {
            for (Map<String, Object> project : projects) {
                Map<String, Object> projectData = new HashMap<>(project);
                
                // Calculate progress percentage based on task status
                int completedTasks = ((Number)project.get("tareas_completadas")).intValue();
                int inProgressTasks = ((Number)project.get("tareas_en_progreso")).intValue();
                int toDoTasks = ((Number)project.get("tareas_por_hacer")).intValue();
                int totalTasks = completedTasks + inProgressTasks + toDoTasks;
                
                double progressPercentage = totalTasks > 0 ? 
                        (completedTasks * 100.0 + inProgressTasks * 50.0) / totalTasks : 0;
                
                projectData.put("progress_percentage", Math.round(progressPercentage * 100.0) / 100.0);
                
                // Add estimation precision data if available
                if (projectsPrecision != null) {
                    int projectId = ((Number)project.get("id")).intValue();
                    
                    Optional<Map<String, Object>> projectPrecision = projectsPrecision.stream()
                            .filter(p -> ((Number)p.get("id")).intValue() == projectId)
                            .findFirst();
                    
                    projectPrecision.ifPresent(precisionData -> {
                        projectData.put("hour_deviation", precisionData.get("desviacion_promedio_horas"));
                        projectData.put("day_deviation", precisionData.get("desviacion_promedio_dias"));
                    });
                }
                
                projectProgress.add(projectData);
            }
        }
        
        return projectProgress;
    }
    
    private List<Map<String, Object>> processTeamProductivity() {
        // This would involve more complex queries to calculate team-level productivity
        // For demonstration purposes, we'll return an empty list
        return new ArrayList<>();
    }
    
    private Map<String, Object> analyzeTrends(KpiResponse kpiResponse) {
        Map<String, Object> trendsAnalysis = new HashMap<>();
        
        // For production implementation, this would involve:
        // 1. Historical data analysis
        // 2. Trend identification over time
        // 3. Prediction of future performance
        
        // For demonstration purposes, we'll add placeholder data
        trendsAnalysis.put("trend_analysis_available", false);
        trendsAnalysis.put("message", "Historical trend analysis requires time-series data that would be implemented in production.");
        
        return trendsAnalysis;
    }
    
    // Utility methods for calculations
    
    private double calculateAverage(List<Map<String, Object>> data, String key) {
        if (data == null || data.isEmpty()) {
            return 0;
        }
        
        double sum = 0;
        int count = 0;
        
        for (Map<String, Object> item : data) {
            if (item.containsKey(key) && item.get(key) != null) {
                Object value = item.get(key);
                if (value instanceof Number) {
                    sum += ((Number) value).doubleValue();
                    count++;
                }
            }
        }
        
        return count > 0 ? sum / count : 0;
    }
    
    private int calculateSum(List<Map<String, Object>> data, String key) {
        if (data == null || data.isEmpty()) {
            return 0;
        }
        
        int sum = 0;
        
        for (Map<String, Object> item : data) {
            if (item.containsKey(key) && item.get(key) != null) {
                Object value = item.get(key);
                if (value instanceof Number) {
                    sum += ((Number) value).intValue();
                }
            }
        }
        
        return sum;
    }
} 