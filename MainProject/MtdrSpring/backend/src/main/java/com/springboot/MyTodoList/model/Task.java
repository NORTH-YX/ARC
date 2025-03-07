package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "TASKS")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TASK_ID")
    private int taskId;

    @Column(name = "TASK_NAME", nullable = false, length = 255)
    private String taskName;

    @Column(name = "DESCRIPTION", nullable = false, length = 255)
    private String description;

    @Column(name = "PRIORITY", nullable = false)
    private Integer priority;

    @Column(name = "STATUS", nullable = false, length = 50)
    private String status;

    @ManyToOne
    @JoinColumn(name = "SPRINT_ID", referencedColumnName = "SPRINT_ID")
    private Sprint sprintId;

    @ManyToOne
    @JoinColumn(name = "USER_ID", referencedColumnName = "USER_ID")
    private User userId;

    @Column(name = "CREATION_DATE", nullable = false)
    private OffsetDateTime creationDate;

    @Column(name = "ESTIMATED_FINISH_DATE")
    private OffsetDateTime estimatedFinishDate;

    @Column(name = "REAL_FINISH_DATE")
    private OffsetDateTime realFinishDate;

    @Column(name = "DELETED_AT")
    private OffsetDateTime deletedAt;

    public Task() {
        this.creationDate = OffsetDateTime.now();
    }

    public Task(int taskId, String taskName, String description, Integer priority, String status, Sprint sprintId, User userId, OffsetDateTime creationDate, OffsetDateTime estimatedFinishDate, OffsetDateTime realFinishDate, OffsetDateTime deletedAt) {
        this.taskId = taskId;
        this.taskName = taskName;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.sprintId = sprintId;
        this.userId = userId;
        this.creationDate = creationDate != null ? creationDate : OffsetDateTime.now();
        this.estimatedFinishDate = estimatedFinishDate;
        this.realFinishDate = realFinishDate;
        this.deletedAt = deletedAt;
    }

    public int getTaskId() {
        return taskId;
    }

    public String getTaskName() {
        return taskName;
    }

    public String getDescription() {
        return description;
    }

    public Integer getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public Sprint getSprint() {
        return sprintId;
    }

    public User getUser() {
        return userId;
    }

    public OffsetDateTime getCreationDate() {
        return creationDate;
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

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setSprint(Sprint sprintId) {
        this.sprintId = sprintId;
    }

    public void setUser(User userId) {
        this.userId = userId;
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
        return "Task{" +
                "taskId=" + taskId +
                ", taskName='" + taskName + '\'' +
                ", description='" + description + '\'' +
                ", priority='" + priority + '\'' +
                ", status='" + status + '\'' +
                ", sprint=" + sprintId +
                ", user=" + userId +
                ", creationDate=" + creationDate +
                ", estimatedFinishDate=" + estimatedFinishDate +
                ", realFinishDate=" + realFinishDate +
                ", deletedAt=" + deletedAt +
                '}';
    }

}
