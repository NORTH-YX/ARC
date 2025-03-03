package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "USER_ID")
    private int userId;

    @Column(name = "NAME", nullable = false, length = 255)
    private String name;

    @Column(name = "EMAIL", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "ROLE", nullable = false, length = 100)
    private String role;

    @Column(name = "WORK_MODALITY", nullable = false, length = 100)
    private String workModality;

    @Column(name = "TELEGRAM_ID", length = 100)
    private String telegramId;

    @Column(name = "PHONE_NUMBER", length = 20)
    private String phoneNumber;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "CREATION_DATE", nullable = false)
    private OffsetDateTime creationDate;

    @Column(name = "DELETED_AT")
    private OffsetDateTime deletedAt;

    @Column(name = "TEAM_ID", nullable = true)
    private Integer teamId;

    public User() {
        this.creationDate = OffsetDateTime.now();
    }

    public User(int userId, String name, String email, String role, String workModality, String telegramId, 
                OffsetDateTime creationDate, OffsetDateTime deletedAt, String phoneNumber, String password, int teamId) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.workModality = workModality;
        this.telegramId = telegramId;
        this.creationDate = creationDate != null ? creationDate : OffsetDateTime.now();
        this.deletedAt = deletedAt;
        this.phoneNumber = phoneNumber;
        this.password = password;
        this.teamId = teamId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getWorkModality() {
        return workModality;
    }

    public void setWorkModality(String workModality) {
        this.workModality = workModality;
    }

    public String getTelegramId() {
        return telegramId;
    }

    public void setTelegramId(String telegramId) {
        this.telegramId = telegramId;
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

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Integer getTeamId() {
        return teamId;
    }

    public void setTeamId(Integer teamId) {
        this.teamId = teamId;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", workModality='" + workModality + '\'' +
                ", teamId=" + teamId + '\'' +
                ", telegramId=" + telegramId +
                ", creationDate=" + creationDate +
                ", deletedAt=" + deletedAt +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
