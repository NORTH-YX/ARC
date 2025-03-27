package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public ResponseEntity<Project> getProjectById(int id) {
        Optional<Project> projectData = projectRepository.findById(id);
        return projectData.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public Optional<Project> findById(int id) {
        return projectRepository.findById(id);
    }

    public Optional<Project> findByProjectName(String projectName) {
        return projectRepository.findByProjectName(projectName);
    }

    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    public Project updateProject(int id, Project project) {
        Optional<Project> projectData = projectRepository.findById(id);
        if (projectData.isPresent()) {
            Project _project = projectData.get();
            _project.setProjectName(project.getProjectName());
            _project.setDescription(project.getDescription());
            _project.setStatus(project.getStatus());
            _project.setStartDate(project.getStartDate());
            _project.setEstimatedFinishDate(project.getEstimatedFinishDate());
            _project.setRealFinishDate(project.getRealFinishDate());
            return projectRepository.save(_project);
        } else {
            return null;
        }
    }

    @Transactional
    public void deleteById(int id) {
        projectRepository.deleteById(id);
    }
}
