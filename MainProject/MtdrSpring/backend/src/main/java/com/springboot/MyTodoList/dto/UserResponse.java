package com.springboot.MyTodoList.dto;
import com.springboot.MyTodoList.model.User;

import java.util.List;

public class UserResponse {
    private List<User> users;
    private int count;
    private String status;

    public UserResponse(List<User> users) {
        this.users = users;
        this.count = users.size();
        this.status = "success";
    }

    // Getters and Setters
    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
        this.count = users.size();
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