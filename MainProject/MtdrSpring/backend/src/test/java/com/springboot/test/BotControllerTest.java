package com.springboot.test;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.repository.TaskRepository;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.controller.ToDoItemBotController;
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

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private ToDoItemBotController botController;

    @Test
    void testGetAllTasks() {
        Task task1 = new Task(1, "Test Case 1", "Develop the new feature", 1, "In Progress", null, null,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 8, null, null);
        Task task2 = new Task(2, "Test Case 2", "Resolve issue in module", 2, "To Do", null, null,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 4, null, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(taskService.findAll()).thenReturn(mockTasks);

        List<Task> tasks = botController.getAllTasks();

        System.out.println("=========================\n   TEST: Get All Tasks\n=========================");
        tasks.forEach(task -> {
        System.out.println(task);
        System.out.println();
        });
        
        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        verify(taskService, times(1)).findAll();
    }

    @Test
    void testGetAllUsers() {
        User user1 = new User(1, "Gera", "gera@example.com", "Developer", "Remote", "1234454", OffsetDateTime.now(), null, "555-1234", "password", 1);
        User user2 = new User(2, "Alex", "alex@example.com", "Manager", "On-site", "6632653", OffsetDateTime.now(), null, "555-5678", "password", 2);
        List<User> mockUsers = List.of(user1, user2);

        when(userService.findAll()).thenReturn(mockUsers);

        List<User> users = botController.getAllUsers();

        System.out.println("=========================\n   TEST: Get All Users\n=========================");
        users.forEach(user -> {
        System.out.println(user);
        System.out.println();
        });
        
        assertNotNull(users);
        assertEquals(2, users.size());
        verify(userService, times(1)).findAll();
    }

    @Test
    void testGetAllSprints() {
        Sprint sprint1 = new Sprint(1, "Sprint 1", 1, "Active", OffsetDateTime.now(), OffsetDateTime.now(), null);
        Sprint sprint2 = new Sprint(2, "Sprint 2", 1, "Completed", OffsetDateTime.now(), OffsetDateTime.now(), null);
        List<Sprint> mockSprints = List.of(sprint1, sprint2);

        when(sprintService.findAll()).thenReturn(mockSprints);

        List<Sprint> sprints = botController.getAllSprints();

        System.out.println("=========================\n   TEST: Get All Sprints\n=========================");
        sprints.forEach(sprint -> {
        System.out.println(sprint);
        System.out.println();
        });
        
        assertNotNull(sprints);
        assertEquals(2, sprints.size());
        verify(sprintService, times(1)).findAll();
    }

    @Test
    void testGetTasksByUserId() {
        User mockUser = new User(1, "Gera", "gera@example.com", "Developer", "Remote", "1234454", OffsetDateTime.now(), null, "555-1234", "password", 1);

        Task task1 = new Task(1, "Test Case 3", "Develop the new feature", 1, "In Progress", null, mockUser,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 8, null, null);
        Task task2 = new Task(2, "Test Case 4", "Resolve issue in module", 2, "To Do", null, mockUser,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 4, null, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(userService.findById(1)).thenReturn(Optional.of(mockUser));
        when(taskService.findByUserId(mockUser)).thenReturn(mockTasks);

        List<Task> tasks = botController.getTasksByUserId(1);

        System.out.println("===============================\n   TEST: Get Tasks By User ID\n===============================");
        tasks.forEach(task -> {
        System.out.println(task);
        System.out.println();
        });
        
        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        verify(userService, times(1)).findById(1);
        verify(taskService, times(1)).findByUserId(mockUser);
    }

    @Test
    void testGetTasksBySprintId() {
        Sprint mockSprint = new Sprint();
        mockSprint.setSprintId(1);

        Task task1 = new Task(1, "Test Case 5", "Develop the new feature", 1, "In Progress", mockSprint, null,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 8, null, null);
        Task task2 = new Task(2, "Test Case 6", "Resolve issue in module", 2, "To Do", mockSprint, null,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 4, null, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(sprintService.findById(1)).thenReturn(Optional.of(mockSprint));
        when(taskService.findBySprintId(mockSprint)).thenReturn(mockTasks);

        List<Task> tasks = botController.getTasksBySprintId(1);

        System.out.println("===============================\n   TEST: Get Completed Tasks By Sprint ID\n===============================");
        tasks.forEach(task -> {
        System.out.println(task);
        System.out.println();
        });
        
        assertNotNull(tasks);
        assertEquals(2, tasks.size());
        verify(sprintService, times(1)).findById(1);
        verify(taskService, times(1)).findBySprintId(mockSprint);
    }

    @Test
    void testAddTask() {
        // Crear un usuario simulado
        User mockUser = new User(1, "Gera", "gera@example.com", "Developer", "Remote", "1234454", OffsetDateTime.now(), null, "555-1234", "password", 1);

        // Crear un sprint simulado
        Sprint mockSprint = new Sprint(1, "Sprint 1", 1, "Active", OffsetDateTime.now(), OffsetDateTime.now(), null);

        // Crear una tarea de ejemplo con el usuario y sprint simulados
        Task newTask = new Task(3, "Test Case 7", "Implement a new feature", 3, "To Do", mockSprint, mockUser,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 5, null, null);

        // Simular que el servicio de tarea devuelve la tarea recién creada (sin usar save() directamente)
        when(taskService.addTask(any(Task.class))).thenReturn(newTask);

        // Llamar al método addTask del servicio
        Task createdTask = taskService.addTask(newTask);

        System.out.println("=========================\n   TEST: Add Task\n=========================");
        System.out.println("Tarea creada: " + createdTask);

        // Verificar que la tarea fue creada correctamente
        assertNotNull(createdTask);
        assertEquals(newTask.getTaskName(), createdTask.getTaskName());
        assertEquals(newTask.getDescription(), createdTask.getDescription());
        assertEquals(newTask.getStatus(), createdTask.getStatus());
        assertEquals(newTask.getEstimatedHours(), createdTask.getEstimatedHours());
    }

    @Test
    void testGetTaskByStatusAndSprintId() {
        Sprint mockSprint = new Sprint(1, "Sprint 1", 1, "Active", OffsetDateTime.now(), OffsetDateTime.now(), null);

        Task task1 = new Task(1, "Test Case 8", "Develop the new feature", 1, "Completed", mockSprint, null,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 8, 4, null);
        Task task2 = new Task(2, "Test Case 9", "Resolve issue in module", 2, "Completed", mockSprint, null,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 4, 4, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(taskService.findByStatusAndSprintId("Completed", mockSprint)).thenReturn(mockTasks);

        List<Task> tasks = taskService.findByStatusAndSprintId("Completed", mockSprint);
        System.out.println("===============================\n   TEST: Get Completed Tasks By Sprint\n===============================");
        tasks.forEach(task -> {
        System.out.println(task);
        System.out.println();
        });
        
        assertNotNull(tasks);
    }

    @Test
    void GetTaskByStatusAndUserIdAndSprintId() {
        Sprint mockSprint = new Sprint(1, "Sprint 1", 1, "Active", OffsetDateTime.now(), OffsetDateTime.now(), null);
        User mockUser = new User(1, "Gera", "gera@example.com", "Developer", "Remote", "1234454", OffsetDateTime.now(), null, "555-1234", "password", 1);

        Task task1 = new Task(1, "Test Case 10", "Develop the new feature", 1, "Completed", mockSprint, mockUser,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 8, 4, null);
        Task task2 = new Task(2, "Test Case 11", "Resolve issue in module", 2, "Completed", mockSprint, mockUser,
                OffsetDateTime.now(), OffsetDateTime.now(), null, 4, 4, null);
        List<Task> mockTasks = List.of(task1, task2);

        when(taskService.findByStatusAndUserIdAndSprintId("Completed", mockUser, mockSprint)).thenReturn(mockTasks);

        List<Task> tasks = taskService.findByStatusAndUserIdAndSprintId("Completed", mockUser, mockSprint);
        System.out.println("===============================\n   TEST: Get Completed Tasks By User and Sprint\n===============================");
        tasks.forEach(task -> {
        System.out.println(task);
        System.out.println();
        });
        assertNotNull(tasks);
    }
}