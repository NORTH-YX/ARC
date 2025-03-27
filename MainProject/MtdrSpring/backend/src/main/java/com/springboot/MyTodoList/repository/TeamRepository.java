package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.Team;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Integer> {
    Optional<Team> findByTeamName(String teamName);
    List<Team> findByManager(User manager); // Buscar equipos por manager (objeto)
    Optional<Team> findByProject(Project project); // Un equipo por proyecto (1:1)
}
