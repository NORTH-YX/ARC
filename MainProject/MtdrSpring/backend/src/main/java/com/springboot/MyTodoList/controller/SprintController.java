package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.SprintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sprints")
@CrossOrigin(origins = "*")
public class SprintController {

    @Autowired
    private SprintService sprintService;

    @GetMapping
    public ResponseEntity<List<Sprint>> getAllSprints() {
        List<Sprint> sprints = sprintService.findAll();
        return ResponseEntity.ok(sprints);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sprint> getSprintById(@PathVariable int id) {
        Optional<Sprint> sprint = sprintService.findById(id);
        return sprint.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Sprint>> getSprintsByProjectId(@PathVariable Integer projectId) {
        List<Sprint> sprints = sprintService.findByProjectId(projectId);
        if (sprints.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(sprints);
    }

    @PostMapping
    public ResponseEntity<Sprint> addSprint(@RequestBody Sprint sprint) {
        Sprint newSprint = sprintService.addSprint(sprint);
        return ResponseEntity.ok(newSprint);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable int id) {
        sprintService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}