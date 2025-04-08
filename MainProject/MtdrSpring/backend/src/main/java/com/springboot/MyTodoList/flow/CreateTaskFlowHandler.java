package com.springboot.MyTodoList.flow;

import com.springboot.MyTodoList.dto.TaskDTO;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Sprint;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.Map;

@Component
public class CreateTaskFlowHandler {

    @Autowired
    private TaskService taskService;
    
    // Assuming you have services for Sprint and Project lookup:
    // @Autowired
    // private SprintService sprintService;
    // @Autowired
    // private ProjectService projectService;
    // @Autowired
    // private UserService userService; // if needed

    /**
     * Maps the parameters from the NLP action into a TaskDTO.
     */
    public TaskDTO mapToTaskDTO(Map<String, Object> params) {
        TaskDTO dto = new TaskDTO();
        
        dto.setTaskName((String) params.get("NAME"));
        dto.setDescription((String) params.get("DESCRIPTION"));
        
        String priorityStr = (String) params.get("PRIORITY");
        if (priorityStr != null) {
            try {
                dto.setPriority(Integer.valueOf(priorityStr));
            } catch (NumberFormatException e) {
                dto.setPriority(3); // default priority
            }
        }
        
        String status = (String) params.get("STATUS");
        dto.setStatus((status == null || status.trim().isEmpty()) ? "TO DO" : status);
        
        String estimatedFinishDateStr = (String) params.get("ESTIMATED_FINISH_DATE");
        if (estimatedFinishDateStr != null) {
            try {
                dto.setEstimatedFinishDate(OffsetDateTime.parse(estimatedFinishDateStr));
            } catch (Exception e) {
                dto.setEstimatedFinishDate(null);
            }
        }
        
        Object sprintIdObj = params.get("SPRINT_ID");
        if (sprintIdObj != null) {
            dto.setSprintId(Long.valueOf(sprintIdObj.toString()));
        } else {
            dto.setSprintId(null);
        }
        
        Object projectIdObj = params.get("PROJECT_ID");
        if (projectIdObj != null) {
            dto.setProjectId(Long.valueOf(projectIdObj.toString()));
        } else {
            dto.setProjectId(null);
        }
        
        Object userIdObj = params.get("USER_ID");
        if (userIdObj != null) {
            dto.setUserId(Long.valueOf(userIdObj.toString()));
        }
        
        return dto;
    }

    /**
     * Converts a TaskDTO into a Task entity.
     * You might need to retrieve Sprint and Project entities via their services.
     */
    public Task convertTaskDTOToTask(TaskDTO dto) {
        Task task = new Task();
        task.setTaskName(dto.getTaskName());
        task.setDescription(dto.getDescription());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus());
        task.setEstimatedFinishDate(dto.getEstimatedFinishDate());
        
        // For demonstration purposes, we are not retrieving full Sprint and Project entities.
        // In production, you should use sprintService and projectService to fetch these.
        // Example:
        // Sprint sprint = sprintService.findById(dto.getSprintId()).orElseThrow(() -> new IllegalArgumentException("Sprint not found"));
        // task.setSprint(sprint);
        // Project project = projectService.findById(dto.getProjectId()).orElseThrow(() -> new IllegalArgumentException("Project not found"));
        // task.setProject(project);
        
        // Set additional fields as needed.
        
        return task;
    }
    
    /**
     * Executes the create task flow.
     */
    public Task executeCreateTaskFlow(Map<String, Object> params) {
        TaskDTO dto = mapToTaskDTO(params);
        Task task = convertTaskDTOToTask(dto);
        return taskService.addTask(task);
    }
}