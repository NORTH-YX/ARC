package com.springboot.MyTodoList.dto;

public class ProjectDTO {
    private int projectId;
    private String projectName;
    private String description;
    private String status;
    private TeamDTO team;
    private int count;
    private String responseStatus;
    private int activeCount;
    private int onHoldCount;
    private int completedCount;

    // Constructor
    public ProjectDTO(int projectId, String projectName, String description, String status, TeamDTO team, int count, String responseStatus, int activeCount, int onHoldCount, int completedCount) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.description = description;
        this.status = status;
        this.team = team;
        this.count = count;
        this.responseStatus = responseStatus;
        this.activeCount = activeCount;
        this.onHoldCount = onHoldCount;
        this.completedCount = completedCount;
    }

    // Getters y Setters
    public int getProjectId() {
        return projectId;
    }

    public void setProjectId(int projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getResponseStatus() {
        return responseStatus;
    }

    public void setResponseStatus(String responseStatus) {
        this.responseStatus = responseStatus;
    }

    public int getActiveCount() {
        return activeCount;
    }

    public void setActiveCount(int activeCount) {
        this.activeCount = activeCount;
    }

    public int getOnHoldCount() {
        return onHoldCount;
    }

    public void setOnHoldCount(int onHoldCount) {
        this.onHoldCount = onHoldCount;
    }

    public int getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(int completedCount) {
        this.completedCount = completedCount;
    }
}