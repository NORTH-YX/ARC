package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@CrossOrigin(origins = "*") 
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        return ResponseEntity.ok(tasks);
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
    public ResponseEntity<Task> addTask(@RequestBody Task task) {
        Task newTask = taskService.addTask(task);
        return ResponseEntity.ok(newTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable int id) {
        taskService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
