package com.springboot.MyTodoList.dto;

import java.time.OffsetDateTime;

public class TaskDTO {
    private String taskName;
    private String description;
    private Integer priority;
    private String status;
    private OffsetDateTime estimatedFinishDate;
    private Long sprintId;
    private Long userId;
    private Long projectId;

    // Getters y setters
    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Integer getPriority() {
        return priority;
    }
    public void setPriority(Integer priority) {
        this.priority = priority;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public OffsetDateTime getEstimatedFinishDate() {
        return estimatedFinishDate;
    }
    public void setEstimatedFinishDate(OffsetDateTime estimatedFinishDate) {
        this.estimatedFinishDate = estimatedFinishDate;
    }
    public Long getSprintId() {
        return sprintId;
    }
    public void setSprintId(Long sprintId) {
        this.sprintId = sprintId;
    }
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    public Long getProjectId() {
        return projectId;
    }
    
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }
}