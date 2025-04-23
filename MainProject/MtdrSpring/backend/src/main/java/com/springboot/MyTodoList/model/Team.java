package com.springboot.MyTodoList.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;

@Entity
@Table(name = "TEAMS")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TEAM_ID", nullable = false)
    private int teamId;

    @Column(name = "TEAM_NAME", nullable = false, length = 255, unique = true)
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "MANAGER_ID", nullable = false)
    private User manager;

    @ManyToOne
    @JoinColumn(name = "PROJECT_ID", unique = true)
    @JsonBackReference
    private Project project;

    @JsonProperty("projectId")
    public Integer getProjectId() {
        return project != null ? project.getProjectId() : null;
    }

    @Column(name = "CREATION_DATE")
    private OffsetDateTime creationDate;

    @Column(name = "DELETED_AT")
    private OffsetDateTime deletedAt;

    // Constructor vacío obligatorio para JPA
    public Team() {}

    // Constructor con parámetros
    public Team(int teamId, String teamName, User manager, Project project, OffsetDateTime creationDate, OffsetDateTime deletedAt) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.manager = manager;
        this.project = project;
        this.creationDate = creationDate;
        this.deletedAt = deletedAt;
    }

    // Getters y Setters
    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public User getManager() {
        return manager;
    }

    public void setManager(User manager) {
        this.manager = manager;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public OffsetDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(OffsetDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public OffsetDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(OffsetDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    // Método para marcar el equipo como eliminado
    public void markAsDeleted() {
        this.deletedAt = OffsetDateTime.now();
    }

    @Override
    public String toString() {
        return "Team{" +
                "teamId=" + teamId +
                ", teamName='" + teamName + '\'' +
                ", manager=" + (manager != null ? manager.getUserId() : "null") +
                ", project=" + (project != null ? project.getProjectId() : "null") +
                ", creationDate=" + creationDate +
                ", deletedAt=" + deletedAt +
                '}';
    }
}
