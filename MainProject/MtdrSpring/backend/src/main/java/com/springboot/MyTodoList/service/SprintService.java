package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.repository.SprintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    public List<Sprint> findAll() {
        return sprintRepository.findAll();
    }

    public Optional<Sprint> findById(int id) {
        return sprintRepository.findById(id);
    }

    public Optional<Sprint> findBySprintName(String sprintName) {
        return sprintRepository.findBySprintName(sprintName);
    }

    public List<Sprint> findByProjectId(Integer projectId) {
        return sprintRepository.findByProjectId(projectId);
    }

    public List<Sprint> findByStatus(String status) {
        return sprintRepository.findByStatus(status);
    }

    public Sprint addSprint(Sprint sprint) {
        return sprintRepository.save(sprint);
    }

    @Transactional
    public void deleteById(int id) {
        sprintRepository.deleteById(id);
    }
}

