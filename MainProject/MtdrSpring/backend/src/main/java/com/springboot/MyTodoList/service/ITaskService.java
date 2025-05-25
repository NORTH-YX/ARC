package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.KpiResponse;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface ITaskService {
    List<Task> findAll();
    ResponseEntity<Task> getTaskById(int id);
    Optional<Task> findById(int id);
    Optional<Task> findByTaskName(String taskName);
    List<Task> findByUserId(User userId);
    List<Task> findBySprintId(Sprint sprintId);
    List<Task> findByPriority(Integer priority);
    List<Task> findByStatus(String status);
    List<Task> findByStatusAndSprintId(String status, Sprint sprintId);
    List<Task> findByStatusAndUserIdAndSprintId(String status, User userId, Sprint sprintId);
    Task addTask(Task task);
    Task updateTask(int id, Task task);
    void deleteById(int id);
    KpiResponse getComplianceRateKpis(String fechaConsulta);
    KpiResponse getKpisByUserId(int userId, String fechaConsulta);
    KpiResponse getKpisBySprintId(int sprintId, String fechaConsulta);
}
