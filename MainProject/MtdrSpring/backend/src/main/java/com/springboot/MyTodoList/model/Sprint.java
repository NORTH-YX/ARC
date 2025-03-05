package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "SPRINTS")
public class Sprint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SPRINT_ID")
    private int SprintId;

    @Column(name = "SPRINT_NAME", nullable = false, length = 255)
    private String sprintName;

    @Column(name = "PROJECT_ID", nullable = false)
    private Integer projectId;

    @Column(name = "STATUS", nullable = false, length = 50)
    private String status;

    @Column(name = "START_DATE", nullable = false)
    private OffsetDateTime creationDate;

    @Column(name = "FINISH_DATE", nullable = false)
    private OffsetDateTime estimatedFinishDate;

    @Column(name = "DELETED_AT")
    private OffsetDateTime deletedAt;

    public Sprint() {
        this.creationDate = OffsetDateTime.now();
    }

    public Sprint(int SprintId, String sprintName, Integer projectId, String status, OffsetDateTime creationDate, OffsetDateTime estimatedFinishDate, OffsetDateTime deletedAt) {
        this.SprintId = SprintId;
        this.sprintName = sprintName;
        this.projectId = projectId;
        this.status = status;
        this.creationDate = creationDate != null ? creationDate : OffsetDateTime.now();
        this.estimatedFinishDate = estimatedFinishDate;
        this.deletedAt = deletedAt;
    }

    public int getSprintId() {
        return SprintId;
    }

    public void setSprintId(int SprintId) {
        this.SprintId = SprintId;
    }

    public String getSprintName() {
        return sprintName;
    }

    public void setSprintName(String sprintName) {
        this.sprintName = sprintName;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(OffsetDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public OffsetDateTime getEstimatedFinishDate() {
        return estimatedFinishDate;
    }

    public void setEstimatedFinishDate(OffsetDateTime estimatedFinishDate) {
        this.estimatedFinishDate = estimatedFinishDate;
    }

    public OffsetDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(OffsetDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    @Override
    public String toString() {
        return "Sprint{" +
                "SprintId=" + SprintId +
                ", sprintName='" + sprintName + '\'' +
                ", projectId=" + projectId +
                ", status='" + status + '\'' +
                ", creationDate=" + creationDate +
                ", estimatedFinishDate=" + estimatedFinishDate +
                ", deletedAt=" + deletedAt +
                '}';
    }

}