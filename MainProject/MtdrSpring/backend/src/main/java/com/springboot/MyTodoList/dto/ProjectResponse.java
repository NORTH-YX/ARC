package com.springboot.MyTodoList.dto;
import com.springboot.MyTodoList.model.Project;

import java.util.List;

public class ProjectResponse {
    private List<Project> projects;
    private int count;
    private String status;

    public ProjectResponse(List<Project> projects) {
        this.projects = projects;
        this.count = projects.size();
        this.status = "success";
    }

    // Getters and Setters
    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
        this.count = projects.size();
    }

    public int getCount() {
        return count;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}