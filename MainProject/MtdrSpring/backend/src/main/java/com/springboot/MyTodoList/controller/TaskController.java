package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;

import oracle.net.aso.f;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import com.springboot.MyTodoList.dto.KpiResponse;
import com.springboot.MyTodoList.dto.TaskResponse;

@RestController
@RequestMapping("api/tasks")
@CrossOrigin(origins = "*") 
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<TaskResponse> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        TaskResponse response = new TaskResponse(tasks);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable int id) {
        Optional<Task> task = taskService.findById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getTasksByUserId(@PathVariable Integer userId) {
        Optional<User> user = userService.findById(userId);
        if (!user.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        List<Task> tasks = taskService.findByUserId(user.get());
        if (tasks.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<String> addTask(@RequestBody Task task) {
        Task newTask = taskService.addTask(task);
        String responseMessage = String.format("Task created successfully with ID %d.", newTask.getTaskId());
        return ResponseEntity.ok(responseMessage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable int id, @RequestBody Task task) {
        try {
            Task updatedTask = taskService.updateTask(id, task);
            return ResponseEntity.ok(updatedTask); // Return the updated task as JSON
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build(); // Return 404 if the task is not found
        } catch (Exception e) {
            return ResponseEntity.status(500).build(); // Return 500 for unexpected errors
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable int id) {
        Optional<Task> task = taskService.findById(id);
        if (task.isPresent()) {
            taskService.deleteById(id);
            String responseMessage = String.format("Task with ID %d and name '%s' was successfully deleted.", id, task.get().getTaskName());
            return ResponseEntity.ok(responseMessage);
        } else {
            return ResponseEntity.status(404).body(String.format("Task with ID %d not found.", id));
        }
    }

    @GetMapping("/kpis")
    public Map<String, Object> getComplianceRate() {

        String fechaConsulta = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        KpiResponse kpiResponse = taskService.getComplianceRateKpis(fechaConsulta);

        // Envolverlo como: { "kpis": { "compliance_rate": {...} } }
        Map<String, Object> wrapper = new HashMap<>();
        wrapper.put("kpis", kpiResponse);

        return wrapper;
    }
}
