package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.StatisticalReportDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Service responsible for generating managerial suggestions based on project data
 * using LLM technology
 */
@Service
public class AIManagerService {

    @Autowired
    private StatisticalReportService statisticalReportService;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Value("${ai.service.url:}")
    private String aiServiceUrl;
    
    @Value("${ai.service.api.key:}")
    private String apiKey;
    
    /**
     * Generate management suggestions based on comprehensive project data
     * @return List of management suggestions with context
     */
    public List<Map<String, Object>> getComprehensiveSuggestions() {
        // Generate the statistical report
        StatisticalReportDTO report = statisticalReportService.generateComprehensiveReport();
        
        // Get AI-generated suggestions based on the report
        return generateSuggestionsFromReport(report, "comprehensive");
    }
    
    /**
     * Generate management suggestions for a specific project
     * @param projectId The ID of the project to analyze
     * @return List of management suggestions specific to the project
     */
    public List<Map<String, Object>> getProjectSuggestions(int projectId) {
        // Generate the project-specific statistical report
        StatisticalReportDTO report = statisticalReportService.generateProjectReport(projectId);
        
        // Get AI-generated suggestions based on the report
        return generateSuggestionsFromReport(report, "project");
    }
    
    /**
     * Generate management suggestions for a specific sprint
     * @param sprintId The ID of the sprint to analyze
     * @return List of management suggestions specific to the sprint
     */
    public List<Map<String, Object>> getSprintSuggestions(int sprintId) {
        // Generate the sprint-specific statistical report
        StatisticalReportDTO report = statisticalReportService.generateSprintReport(sprintId);
        
        // Get AI-generated suggestions based on the report
        return generateSuggestionsFromReport(report, "sprint");
    }
    
    /**
     * Call the AI service to generate management suggestions based on the provided report
     * @param report The statistical report with project data
     * @param reportType The type of report (comprehensive, project, sprint)
     * @return List of management suggestions
     */
    private List<Map<String, Object>> generateSuggestionsFromReport(StatisticalReportDTO report, String reportType) {
        List<Map<String, Object>> suggestions = new ArrayList<>();
        
        // If no AI service URL is configured, return mock suggestions
        if (aiServiceUrl == null || aiServiceUrl.isEmpty()) {
            return generateMockSuggestions(report, reportType);
        }
        
        try {
            // Prepare headers with API key
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (apiKey != null && !apiKey.isEmpty()) {
                headers.set("Authorization", "Bearer " + apiKey);
            }
            
            // Create request payload
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("report", report);
            requestBody.put("reportType", reportType);
            
            // Make API call to AI service
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(aiServiceUrl, request, Map.class);
            
            // Process response
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map responseBody = response.getBody();
                if (responseBody.containsKey("suggestions") && responseBody.get("suggestions") instanceof List) {
                    List<Map<String, Object>> responseSuggestions = (List<Map<String, Object>>) responseBody.get("suggestions");
                    suggestions.addAll(responseSuggestions);
                }
            }
        } catch (Exception e) {
            // Log the error but don't crash
            e.printStackTrace();
            // Fall back to mock suggestions
            suggestions = generateMockSuggestions(report, reportType);
        }
        
        return suggestions;
    }
    
    /**
     * Generate mock suggestions for demonstration purposes when no AI service is available
     * @param report The statistical report
     * @param reportType The type of report
     * @return List of mock management suggestions
     */
    private List<Map<String, Object>> generateMockSuggestions(StatisticalReportDTO report, String reportType) {
        List<Map<String, Object>> mockSuggestions = new ArrayList<>();
        
        // Generate suggestions based on the report type and data
        switch (reportType) {
            case "comprehensive":
                addComprehensiveMockSuggestions(mockSuggestions, report);
                break;
            case "project":
                addProjectMockSuggestions(mockSuggestions, report);
                break;
            case "sprint":
                addSprintMockSuggestions(mockSuggestions, report);
                break;
        }
        
        return mockSuggestions;
    }
    
    private void addComprehensiveMockSuggestions(List<Map<String, Object>> suggestions, StatisticalReportDTO report) {
        // Extract relevant metrics for decision making
        Map<String, Object> summaryMetrics = report.getSummaryMetrics();
        if (summaryMetrics == null) {
            return;
        }
        
        double complianceRate = 0;
        if (summaryMetrics.containsKey("average_compliance_rate")) {
            complianceRate = ((Number) summaryMetrics.get("average_compliance_rate")).doubleValue();
        }
        
        // Add suggestions based on compliance rate
        if (complianceRate < 70) {
            Map<String, Object> suggestion = new HashMap<>();
            suggestion.put("type", "warning");
            suggestion.put("title", "Low Overall Compliance Rate");
            suggestion.put("description", "The overall project compliance rate is below 70%. Consider implementing a regular check-in system to identify blockers earlier.");
            suggestion.put("action_items", Arrays.asList(
                "Schedule daily stand-ups for teams with lowest completion rates",
                "Review estimation techniques as tasks may be underestimated",
                "Implement a 'buddy system' where team members can help unblock each other"
            ));
            suggestions.add(suggestion);
        } else if (complianceRate > 90) {
            Map<String, Object> suggestion = new HashMap<>();
            suggestion.put("type", "success");
            suggestion.put("title", "High Overall Compliance Rate");
            suggestion.put("description", "The team is achieving a high compliance rate. Consider if tasks are being properly challenged.");
            suggestion.put("action_items", Arrays.asList(
                "Evaluate if task estimations are too conservative",
                "Consider increasing project scope or complexity to challenge the team",
                "Share the successful practices with other teams"
            ));
            suggestions.add(suggestion);
        }
        
        // Add general suggestion about estimation precision
        if (summaryMetrics.containsKey("average_hour_deviation")) {
            double hourDeviation = ((Number) summaryMetrics.get("average_hour_deviation")).doubleValue();
            
            if (Math.abs(hourDeviation) > 8) {
                Map<String, Object> suggestion = new HashMap<>();
                suggestion.put("type", "info");
                suggestion.put("title", "Significant Time Estimation Deviation");
                suggestion.put("description", String.format("Tasks are taking an average of %.1f hours %s than estimated.", 
                        Math.abs(hourDeviation), hourDeviation > 0 ? "longer" : "shorter"));
                suggestion.put("action_items", Arrays.asList(
                    "Review estimation techniques with the team",
                    "Consider implementing planning poker or other collaborative estimation techniques",
                    "Break down larger tasks into smaller, more predictable units"
                ));
                suggestions.add(suggestion);
            }
        }
        
        // Add resource utilization suggestion
        Map<String, Object> resourceSuggestion = new HashMap<>();
        resourceSuggestion.put("type", "info");
        resourceSuggestion.put("title", "Resource Optimization");
        resourceSuggestion.put("description", "Consider balancing workload across team members to optimize productivity.");
        resourceSuggestion.put("action_items", Arrays.asList(
            "Analyze individual performance metrics to identify overloaded team members",
            "Redistribute tasks based on skill sets and current workload",
            "Consider cross-training to build team resilience"
        ));
        suggestions.add(resourceSuggestion);
    }
    
    private void addProjectMockSuggestions(List<Map<String, Object>> suggestions, StatisticalReportDTO report) {
        // Extract project progress data
        List<Map<String, Object>> projectProgress = report.getProjectProgress();
        if (projectProgress == null || projectProgress.isEmpty()) {
            return;
        }
        
        // For demo purposes, we'll use the first project in the list
        Map<String, Object> project = projectProgress.get(0);
        
        // Add suggestion based on project progress
        if (project.containsKey("progress_percentage")) {
            double progressPercentage = ((Number) project.get("progress_percentage")).doubleValue();
            
            Map<String, Object> suggestion = new HashMap<>();
            suggestion.put("title", "Project Progress Evaluation");
            
            if (progressPercentage < 30) {
                suggestion.put("type", "warning");
                suggestion.put("description", "Project progress is in early stages. Ensure proper foundation is being laid.");
                suggestion.put("action_items", Arrays.asList(
                    "Verify that all requirements are clearly documented",
                    "Ensure architectural decisions are aligned with project goals",
                    "Set up proper metrics tracking for the project"
                ));
            } else if (progressPercentage < 70) {
                suggestion.put("type", "info");
                suggestion.put("description", "Project is in its main development phase. Focus on maintaining momentum.");
                suggestion.put("action_items", Arrays.asList(
                    "Monitor velocity and address any slowdowns promptly",
                    "Ensure regular code reviews are happening",
                    "Keep stakeholders updated on progress"
                ));
            } else {
                suggestion.put("type", "success");
                suggestion.put("description", "Project is nearing completion. Focus on quality and delivery.");
                suggestion.put("action_items", Arrays.asList(
                    "Increase testing efforts to ensure quality",
                    "Start preparing deployment documentation",
                    "Plan for knowledge transfer and handover if applicable"
                ));
            }
            
            suggestions.add(suggestion);
        }
        
        // Add project-specific risk assessment
        Map<String, Object> riskSuggestion = new HashMap<>();
        riskSuggestion.put("type", "info");
        riskSuggestion.put("title", "Project Risk Assessment");
        riskSuggestion.put("description", "Regular risk assessment can help identify potential issues before they impact the project.");
        riskSuggestion.put("action_items", Arrays.asList(
            "Schedule a risk assessment workshop with the team",
            "Update the risk register with any new identified risks",
            "Assign risk owners for each significant risk"
        ));
        suggestions.add(riskSuggestion);
    }
    
    private void addSprintMockSuggestions(List<Map<String, Object>> suggestions, StatisticalReportDTO report) {
        // Extract sprint summary metrics
        Map<String, Object> summaryMetrics = report.getSummaryMetrics();
        if (summaryMetrics == null) {
            return;
        }
        
        // Extract user performance for this sprint
        List<Map<String, Object>> userPerformance = report.getUserPerformance();
        
        // Add sprint velocity suggestion
        Map<String, Object> velocitySuggestion = new HashMap<>();
        velocitySuggestion.put("type", "info");
        velocitySuggestion.put("title", "Sprint Velocity Analysis");
        
        if (summaryMetrics.containsKey("completed_tasks") && summaryMetrics.containsKey("to_do_tasks")) {
            int completedTasks = ((Number) summaryMetrics.get("completed_tasks")).intValue();
            int toDoTasks = ((Number) summaryMetrics.get("to_do_tasks")).intValue();
            
            if (completedTasks == 0 && toDoTasks > 0) {
                velocitySuggestion.put("description", "No tasks have been completed yet in this sprint. Monitor progress closely.");
                velocitySuggestion.put("action_items", Arrays.asList(
                    "Check if team members are facing any blockers",
                    "Verify that tasks are properly sized for the sprint",
                    "Consider a mid-sprint check-in to realign goals"
                ));
            } else if (toDoTasks > completedTasks * 2) {
                velocitySuggestion.put("description", "There are many tasks still to do compared to what's been completed. Sprint scope may be too large.");
                velocitySuggestion.put("action_items", Arrays.asList(
                    "Consider reducing sprint scope to ensure quality delivery",
                    "Identify which tasks are most critical for this sprint",
                    "Analyze if the team has proper capacity for the sprint"
                ));
            } else {
                velocitySuggestion.put("description", "Sprint velocity appears to be on track.");
                velocitySuggestion.put("action_items", Arrays.asList(
                    "Continue monitoring progress",
                    "Prepare for sprint review and retrospective",
                    "Start planning for the next sprint"
                ));
            }
            
            suggestions.add(velocitySuggestion);
        }
        
        // Add team member performance suggestions if available
        if (userPerformance != null && !userPerformance.isEmpty()) {
            // Find team members who may be struggling
            List<String> strugglingMembers = new ArrayList<>();
            
            for (Map<String, Object> user : userPerformance) {
                if (user.containsKey("compliance_rate") && 
                    ((Number) user.get("compliance_rate")).doubleValue() < 60) {
                    strugglingMembers.add((String) user.get("user_name"));
                }
            }
            
            if (!strugglingMembers.isEmpty()) {
                Map<String, Object> teamSuggestion = new HashMap<>();
                teamSuggestion.put("type", "warning");
                teamSuggestion.put("title", "Team Member Support Needed");
                teamSuggestion.put("description", "Some team members may need additional support to meet their sprint goals.");
                teamSuggestion.put("context", String.format("Team members with low compliance rates: %s", String.join(", ", strugglingMembers)));
                teamSuggestion.put("action_items", Arrays.asList(
                    "Schedule one-on-one check-ins with the identified team members",
                    "Assess if they have the resources and support needed",
                    "Consider redistributing tasks if workload is unbalanced"
                ));
                suggestions.add(teamSuggestion);
            }
        }
        
        // Add sprint retrospective suggestion
        Map<String, Object> retroSuggestion = new HashMap<>();
        retroSuggestion.put("type", "info");
        retroSuggestion.put("title", "Sprint Retrospective Planning");
        retroSuggestion.put("description", "A thorough retrospective can help improve future sprints.");
        retroSuggestion.put("action_items", Arrays.asList(
            "Schedule the retrospective with the whole team",
            "Prepare data points from the sprint to discuss",
            "Focus on actionable improvements for the next sprint"
        ));
        suggestions.add(retroSuggestion);
    }
} 