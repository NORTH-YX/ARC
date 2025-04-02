package com.springboot.test;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.controller.ToDoItemBotController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ToDoItemBotControllerTest {

    @Mock
    private TaskService taskService;

    @Mock
    private UserService userService;

    @Mock
    private SprintService sprintService;

    @InjectMocks
    private ToDoItemBotController botController;

    @Test
    void testGetAllTasks() {
        Task task1 = new Task(1, "Implement feature X", "Develop the new feature", 1, "In Progress", null, null,
                OffsetDateTime.now(), null, null, 8, null, null);
        Task task2 = new Task(2, "Fix bug Y", "Resolve issue in module", 2, "To Do", null, null,
                OffsetDateTime.now(), null, null, 4, null, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(taskService.findAll()).thenReturn(mockTasks);

        List<Task> tasks = botController.getAllTasks();

        System.out.println("=========================\n   TEST: Get All Tasks\n=========================");
        tasks.forEach(System.out::println);
        
        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        verify(taskService, times(1)).findAll();
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User(1, "Alice", "alice@example.com", "Developer", "Remote", "1234454", OffsetDateTime.now(), null, "555-1234", "password", 1);
        User user2 = new User(2, "Bob", "bob@example.com", "Manager", "On-site", "6632653", OffsetDateTime.now(), null, "555-5678", "password", 2);
        List<User> mockUsers = List.of(user1, user2);

        when(userService.findAll()).thenReturn(mockUsers);

        List<User> users = botController.getAllUsers();

        System.out.println("=========================\n   TEST: Get All Users\n=========================");
        users.forEach(System.out::println);
        
        assertNotNull(users);
        assertEquals(2, users.size());
        verify(userService, times(1)).findAll();
    }

    @Test
    void testGetAllSprints() {
        Sprint sprint1 = new Sprint(1, "Sprint 1", null, "Active", OffsetDateTime.now(), null, null);
        Sprint sprint2 = new Sprint(2, "Sprint 2", null, "Completed", OffsetDateTime.now(), OffsetDateTime.now(), null);
        List<Sprint> mockSprints = List.of(sprint1, sprint2);

        when(sprintService.findAll()).thenReturn(mockSprints);

        List<Sprint> sprints = botController.getAllSprints();

        System.out.println("=========================\n   TEST: Get All Sprints\n=========================");
        sprints.forEach(System.out::println);
        
        assertNotNull(sprints);
        assertEquals(2, sprints.size());
        verify(sprintService, times(1)).findAll();
    }

    @Test
    void testGetTasksByUserId() {
        User mockUser = new User();
        mockUser.setUserId(1);

        Task task1 = new Task(1, "Implement feature X", "Develop the new feature", 1, "In Progress", null, mockUser,
                OffsetDateTime.now(), null, null, 8, null, null);
        Task task2 = new Task(2, "Fix bug Y", "Resolve issue in module", 2, "To Do", null, mockUser,
                OffsetDateTime.now(), null, null, 4, null, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(userService.findById(1)).thenReturn(Optional.of(mockUser));
        when(taskService.findByUserId(mockUser)).thenReturn(mockTasks);

        List<Task> tasks = botController.getTasksByUserId(1);

        System.out.println("===============================\n   TEST: Get Tasks By User ID\n===============================");
        tasks.forEach(System.out::println);
        
        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        verify(userService, times(1)).findById(1);
        verify(taskService, times(1)).findByUserId(mockUser);
    }

    @Test
    void testGetTasksBySprintId() {
        Sprint mockSprint = new Sprint();
        mockSprint.setSprintId(1);

        Task task1 = new Task(1, "Implement feature X", "Develop the new feature", 1, "In Progress", mockSprint, null,
                OffsetDateTime.now(), null, null, 8, null, null);
        Task task2 = new Task(2, "Fix bug Y", "Resolve issue in module", 2, "To Do", mockSprint, null,
                OffsetDateTime.now(), null, null, 4, null, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(sprintService.findById(1)).thenReturn(Optional.of(mockSprint));
        when(taskService.findBySprintId(mockSprint)).thenReturn(mockTasks);

        List<Task> tasks = botController.getTasksBySprintId(1);

        System.out.println("===============================\n   TEST: Get Tasks By Sprint ID\n===============================");
        tasks.forEach(System.out::println);
        
        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        verify(sprintService, times(1)).findById(1);
        verify(taskService, times(1)).findBySprintId(mockSprint);
    }
}