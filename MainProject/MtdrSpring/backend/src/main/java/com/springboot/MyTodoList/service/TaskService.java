package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

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
            _task.setTaskName(task.getTaskName());
            _task.setUser(task.getUser());
            _task.setSprint(task.getSprint());
            _task.setPriority(task.getPriority());
            _task.setStatus(task.getStatus());
            _task.setRealHours(task.getRealHours());
            return taskRepository.save(_task);
        } else {
            return null;
        }
    }

    @Transactional
    public void deleteById(int id) {
        taskRepository.deleteById(id);
    }
}
