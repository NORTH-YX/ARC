package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    Optional<Project> findByProjectName(String projectName);
    List<Project> findByStatus(String status);
    List<Project> findByStartDate(String startDate);
    List<Project> findByEstimatedFinishDate(String estimatedFinishDate);
    List<Project> findByRealFinishDate(String realFinishDate);
}
