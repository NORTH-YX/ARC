package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public List<Task> findBySprintId(Integer sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }

    public List<Task> findByPriority(String priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> findByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteById(int id) {
        taskRepository.deleteById(id);
    }
}
