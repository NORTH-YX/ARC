package com.springboot.MyTodoList.dto;

import com.springboot.MyTodoList.model.Task;
import java.util.List;

public class TaskResponse {
    private List<Task> tasks;
    private int count;
    private String status;

    public TaskResponse(List<Task> tasks) {
        this.tasks = tasks;
        this.count = tasks.size();
        this.status = "success";
    }

    // Getters and Setters
    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
        this.count = tasks.size();
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