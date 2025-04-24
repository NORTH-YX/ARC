package com.springboot.MyTodoList.dto;

import java.util.List;

public class TeamDTO {
    private int teamId;
    private String teamName;
    private List<String> members; // Lista de nombres de los miembros

    public TeamDTO(int teamId, String teamName, List<String> members) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.members = members;
    }

    // Getters y Setters
    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<String> getMembers() {
        return members;
    }

    public void setMembers(List<String> members) {
        this.members = members;
    }
}