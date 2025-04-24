package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Team;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.ProjectRepository;
import com.springboot.MyTodoList.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.springboot.MyTodoList.dto.ProjectDTO;
import com.springboot.MyTodoList.dto.TeamDTO;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

     @Autowired
    private UsersRepository usersRepository;

    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    public List<ProjectDTO> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        // Calcular los conteos globales
        int count = projects.size();
        int activeCount = (int) projects.stream().filter(p -> p.getStatus().equalsIgnoreCase("active")).count();            int onHoldCount = (int) projects.stream().filter(p -> p.getStatus().equalsIgnoreCase("on-hold")).count();
        int completedCount = (int) projects.stream().filter(p -> p.getStatus().equalsIgnoreCase("completed")).count();

        return projects.stream().map(project -> {
            Team team = project.getTeam(); // Obtener el equipo asociado al proyecto
            TeamDTO teamDTO = null;

            if (team != null) {
                // Obtener los nombres de los usuarios que pertenecen al equipo
                List<String> memberNames = usersRepository.findByTeamId(team.getTeamId())
                        .stream()
                        .map(User::getName)
                        .collect(Collectors.toList());

                // Construir el DTO del equipo
                teamDTO = new TeamDTO(team.getTeamId(), team.getTeamName(), memberNames);
            }

            // Construir el DTO del proyecto
            return new ProjectDTO(
                    project.getProjectId(),
                    project.getProjectName(),
                    project.getDescription(),
                    project.getStatus(),
                    teamDTO,
                    count,
                    "success",
                    activeCount,
                    onHoldCount,
                    completedCount
            );
        }).collect(Collectors.toList());
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
