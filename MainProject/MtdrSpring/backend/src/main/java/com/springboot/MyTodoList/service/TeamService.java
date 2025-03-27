package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Team;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.repository.TeamRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    public List<Team> findAll() {
        return teamRepository.findAll();
    }

    public Optional<Team> findById(int id) {
        return teamRepository.findById(id);
    }

    public Optional<Team> findByTeamName(String teamName) {
        return teamRepository.findByTeamName(teamName);
    }

    public List<Team> findByManager(User manager) {
        return teamRepository.findByManager(manager);
    }

    public Optional<Team> findByProject(Project project) {
        return teamRepository.findByProject(project);
    }

    public Team addTeam(Team team) {
        return teamRepository.save(team);
    }

    public Team updateTeam(int id, Team team) {
        Optional<Team> teamData = teamRepository.findById(id);
        if (teamData.isPresent()) {
            Team _team = teamData.get();
            _team.setTeamName(team.getTeamName());
            _team.setManager(team.getManager());
            _team.setProject(team.getProject());
            return teamRepository.save(_team);
        } else {
            return null;
        }
    }

    @Transactional
    public void deleteById(int id) {
        teamRepository.deleteById(id);
    }
}
