package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.KpiResponse;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public ResponseEntity<Task> getTaskById(int id) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            return ResponseEntity.ok(taskData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public Optional<Task> findById(int id) {
        return taskRepository.findById(id);
    }

    public Optional<Task> findByTaskName(String taskName) {
        return taskRepository.findByTaskName(taskName);
    }

    // Métodos corregidos para devolver listas
    public List<Task> findByUserId(User userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> findBySprintId(Sprint sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }

    public List<Task> findByPriority(Integer priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> findByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(int id, Task task) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            Task _task = taskData.get();
    
            // Update only non-null fields to avoid overwriting existing data
            if (task.getTaskName() != null) _task.setTaskName(task.getTaskName());
            if (task.getUser() != null) _task.setUser(task.getUser());
            if (task.getSprint() != null) _task.setSprint(task.getSprint());
            if (task.getPriority() != null) _task.setPriority(task.getPriority());
            if (task.getStatus() != null) _task.setStatus(task.getStatus());
            if (task.getRealFinishDate() != null) _task.setRealFinishDate(task.getRealFinishDate());
            if (task.getRealHours() != null) _task.setRealHours(task.getRealHours());
    
            return taskRepository.save(_task);
        } else {
            throw new RuntimeException("Task with ID " + id + " not found.");
        }
    }

    @Transactional
    public void deleteById(int id) {
        taskRepository.deleteById(id);
    }

    public KpiResponse getComplianceRateKpis() {
        Map<String, List<Map<String, Object>>> complianceRate = new HashMap<>();
        Map<String, List<Map<String, Object>>> estimationPrecision = new HashMap<>();

        // Compliance Rate Data
        complianceRate.put("users", convertKeysToLowercase(taskRepository.getUserComplianceRate()));
        complianceRate.put("projects", convertKeysToLowercase(taskRepository.getProjectComplianceRate()));
        complianceRate.put("sprints", convertKeysToLowercase(taskRepository.getSprintComplianceRate()));

        // Estimation Precision Data
        estimationPrecision.put("users", convertKeysToLowercase(taskRepository.getUserEstimationPrecision()));
        estimationPrecision.put("projects", convertKeysToLowercase(taskRepository.getProjectEstimationPrecision()));
        estimationPrecision.put("sprints", convertKeysToLowercase(taskRepository.getSprintEstimationPrecision()));

        return new KpiResponse(complianceRate, estimationPrecision);
    }

    private List<Map<String, Object>> convertKeysToLowercase(List<Map<String, Object>> originalList) {
        List<Map<String, Object>> lowerCaseList = new ArrayList<>();
        for (Map<String, Object> map : originalList) {
            Map<String, Object> lowerCaseMap = new HashMap<>();
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                lowerCaseMap.put(entry.getKey().toLowerCase(), entry.getValue());
            }
            lowerCaseList.add(lowerCaseMap);
        }
        return lowerCaseList;
    }
}
