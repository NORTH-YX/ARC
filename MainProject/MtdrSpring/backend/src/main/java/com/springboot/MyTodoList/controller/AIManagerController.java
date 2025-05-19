package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.service.AIManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller for AI Manager feature providing managerial tips and insights
 */
@RestController
@RequestMapping("/api/ai-manager")
public class AIManagerController {

    @Autowired
    private AIManagerService aiManagerService;

    /**
     * Get comprehensive management suggestions across all projects and sprints
     * @return List of management suggestions with context
     */
    @GetMapping("/suggestions")
    public ResponseEntity<Map<String, Object>> getComprehensiveSuggestions() {
        List<Map<String, Object>> suggestions = aiManagerService.getComprehensiveSuggestions();
        
        Map<String, Object> response = new HashMap<>();
        response.put("suggestions", suggestions);
        response.put("count", suggestions.size());
        response.put("type", "comprehensive");
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Get management suggestions for a specific project
     * @param projectId ID of the project to analyze
     * @return List of project-specific management suggestions
     */
    @GetMapping("/suggestions/project/{projectId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Map<String, Object>> getProjectSuggestions(@PathVariable int projectId) {
        List<Map<String, Object>> suggestions = aiManagerService.getProjectSuggestions(projectId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("suggestions", suggestions);
        response.put("count", suggestions.size());
        response.put("type", "project");
        response.put("projectId", projectId);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    /**
     * Get management suggestions for a specific sprint
     * @param sprintId ID of the sprint to analyze
     * @return List of sprint-specific management suggestions
     */
    @GetMapping("/suggestions/sprint/{sprintId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Map<String, Object>> getSprintSuggestions(@PathVariable int sprintId) {
        List<Map<String, Object>> suggestions = aiManagerService.getSprintSuggestions(sprintId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("suggestions", suggestions);
        response.put("count", suggestions.size());
        response.put("type", "sprint");
        response.put("sprintId", sprintId);
        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
} 