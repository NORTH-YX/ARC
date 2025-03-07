package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Optional<Task> findByTaskName(String taskName);
    
    // CORRECCIÓN: Devolver lista en lugar de Optional
    List<Task> findByUserId(User userId);
    
    List<Task> findBySprintId(Integer sprintId);
    List<Task> findByPriority(Integer priority);
    List<Task> findByStatus(String status);
}