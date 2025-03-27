package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "PROJECTS")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PROJECT_ID")
    private int projectId;

    @Column(name = "PROJECT_NAME", nullable = false, length = 255, unique = true)
    private String projectName;

    @Column(name = "DESCRIPTION", nullable = false, length = 255)
    private String description;

    @Column(name = "STATUS", nullable = false, length = 50)
    private String status;

    @Column(name = "START_DATE", nullable = false)
    private OffsetDateTime startDate;

    @Column(name = "ESTIMATED_FINISH_DATE")
    private OffsetDateTime estimatedFinishDate;

    @Column(name = "REAL_FINISH_DATE")
    private OffsetDateTime realFinishDate;

    @Column(name = "DELETED_AT")
    private OffsetDateTime deletedAt;

    public Project() {
        this.startDate = OffsetDateTime.now();
    }

    public Project(int projectId, String projectName, String description, String status, OffsetDateTime startDate, 
                   OffsetDateTime estimatedFinishDate, OffsetDateTime realFinishDate, OffsetDateTime deletedAt) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.description = description;
        this.status = status;
        this.startDate = startDate != null ? startDate : OffsetDateTime.now();
        this.estimatedFinishDate = estimatedFinishDate;
        this.realFinishDate = realFinishDate;
        this.deletedAt = deletedAt;
    }

    public int getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public String getDescription() {
        return description;
    }

    public String getStatus() {
        return status;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public OffsetDateTime getEstimatedFinishDate() {
        return estimatedFinishDate;
    }

    public OffsetDateTime getRealFinishDate() {
        return realFinishDate;
    }

    public OffsetDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }

    public void setEstimatedFinishDate(OffsetDateTime estimatedFinishDate) {
        this.estimatedFinishDate = estimatedFinishDate;
    }

    public void setRealFinishDate(OffsetDateTime realFinishDate) {
        this.realFinishDate = realFinishDate;
    }

    public void setDeletedAt(OffsetDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    @Override
    public String toString() {
        return "Project{" +
                "projectId=" + projectId +
                ", projectName='" + projectName + '\'' +
                ", description='" + description + '\'' +
                ", status='" + status + '\'' +
                ", startDate=" + startDate +
                ", estimatedFinishDate=" + estimatedFinishDate +
                ", realFinishDate=" + realFinishDate +
                ", deletedAt=" + deletedAt +
                '}';
    }
}
