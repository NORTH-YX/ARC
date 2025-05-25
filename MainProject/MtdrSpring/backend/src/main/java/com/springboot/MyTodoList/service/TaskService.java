package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.dto.KpiResponse;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@Service
public class TaskService implements ITaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public ResponseEntity<Task> getTaskById(int id) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            return ResponseEntity.ok(taskData.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public Optional<Task> findById(int id) {
        return taskRepository.findById(id);
    }

    public Optional<Task> findByTaskName(String taskName) {
        return taskRepository.findByTaskName(taskName);
    }

    // Métodos corregidos para devolver listas
    public List<Task> findByUserId(User userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> findBySprintId(Sprint sprintId) {
        return taskRepository.findBySprintId(sprintId);
    }

    public List<Task> findByPriority(Integer priority) {
        return taskRepository.findByPriority(priority);
    }

    public List<Task> findByStatus(String status) {
        return taskRepository.findByStatus(status);
    }

    //findbystatusandsprintid
    public List<Task> findByStatusAndSprintId(String status, Sprint sprintId) {
        return taskRepository.findByStatusAndSprintId(status, sprintId);
    }

    public List<Task> findByStatusAndUserIdAndSprintId(String status, User userId, Sprint sprintId) {
        return taskRepository.findByStatusAndUserIdAndSprintId(status, userId, sprintId);
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(int id, Task task) {
        Optional<Task> taskData = taskRepository.findById(id);
        if (taskData.isPresent()) {
            Task _task = taskData.get();
    
            // Update only non-null fields to avoid overwriting existing data
            if (task.getTaskName() != null) _task.setTaskName(task.getTaskName());
            if (task.getUser() != null) _task.setUser(task.getUser());
            if (task.getSprint() != null) _task.setSprint(task.getSprint());
            if (task.getPriority() != null) _task.setPriority(task.getPriority());
            if (task.getStatus() != null) _task.setStatus(task.getStatus());
            if (task.getCreationDate() != null) _task.setCreationDate(task.getCreationDate());
            if (task.getEstimatedFinishDate() != null) _task.setEstimatedFinishDate(task.getEstimatedFinishDate());
            if (task.getRealFinishDate() != null) _task.setRealFinishDate(task.getRealFinishDate());
            if (task.getRealHours() != null) _task.setRealHours(task.getRealHours());
            if (task.getEstimatedHours() != null) _task.setEstimatedHours(task.getEstimatedHours());
    

            return taskRepository.save(_task);
        } else {
            throw new RuntimeException("Task with ID " + id + " not found.");
        }
    }

    @Transactional
    public void deleteById(int id) {
        taskRepository.deleteById(id);
    }

    public KpiResponse getComplianceRateKpis(String fechaConsulta) {
        Map<String, List<Map<String, Object>>> complianceRate = new HashMap<>();
        Map<String, List<Map<String, Object>>> estimationPrecision = new HashMap<>();

        // Compliance Rate Data
        complianceRate.put("users", convertKeysToLowercase(taskRepository.getUserComplianceRate(fechaConsulta)));
        complianceRate.put("projects", convertKeysToLowercase(taskRepository.getProjectComplianceRate(fechaConsulta)));
        complianceRate.put("sprints", convertKeysToLowercase(taskRepository.getSprintComplianceRate(fechaConsulta)));

        // Estimation Precision Data
        estimationPrecision.put("users", convertKeysToLowercase(taskRepository.getUserEstimationPrecision()));
        estimationPrecision.put("projects", convertKeysToLowercase(taskRepository.getProjectEstimationPrecision()));
        estimationPrecision.put("sprints", convertKeysToLowercase(taskRepository.getSprintEstimationPrecision()));

        return new KpiResponse(complianceRate, estimationPrecision);
    }

    private List<Map<String, Object>> convertKeysToLowercase(List<Map<String, Object>> originalList) {
        List<Map<String, Object>> lowerCaseList = new ArrayList<>();
        for (Map<String, Object> map : originalList) {
            Map<String, Object> lowerCaseMap = new HashMap<>();
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                lowerCaseMap.put(entry.getKey().toLowerCase(), entry.getValue());
            }
            lowerCaseList.add(lowerCaseMap);
        }
        return lowerCaseList;
    }

    public KpiResponse getKpisByUserId(int userId, String fechaConsulta) {
        // Lógica para obtener los KPIs de un usuario específico
        Map<String, List<Map<String, Object>>> complianceRate = new HashMap<>();
        Map<String, List<Map<String, Object>>> estimationPrecision = new HashMap<>();
    
        complianceRate.put("users", convertKeysToLowercase(taskRepository.getUserComplianceRateById(userId, fechaConsulta)));
        estimationPrecision.put("users", convertKeysToLowercase(taskRepository.getUserEstimationPrecisionById(userId)));
    
        return new KpiResponse(complianceRate, estimationPrecision);
    }
    
    public KpiResponse getKpisBySprintId(int sprintId, String fechaConsulta) {
        // Lógica para obtener los KPIs de un sprint específico
        Map<String, List<Map<String, Object>>> complianceRate = new HashMap<>();
        Map<String, List<Map<String, Object>>> estimationPrecision = new HashMap<>();
    
        complianceRate.put("sprints", convertKeysToLowercase(taskRepository.getSprintComplianceRateById(sprintId, fechaConsulta)));
        estimationPrecision.put("sprints", convertKeysToLowercase(taskRepository.getSprintEstimationPrecisionById(sprintId)));
    
        return new KpiResponse(complianceRate, estimationPrecision);
    }

    public List<Map<String, Object>> getKpisBySprintAndUser() {
        List<Map<String, Object>> complianceRate = taskRepository.getComplianceRateBySprintAndUser();
        List<Map<String, Object>> estimationPrecision = taskRepository.getEstimationPrecisionBySprintAndUser();

        // Mapa para agrupar los datos por sprint
        Map<Integer, Map<String, Object>> sprintMap = new HashMap<>();

        // Procesar compliance rate
        for (Map<String, Object> compliance : complianceRate) {
            int sprintId = ((BigDecimal) compliance.get("sprintId")).intValue();
            String sprintName = (String) compliance.get("sprintName");
            int userId = ((BigDecimal) compliance.get("userId")).intValue();
            String userName = (String) compliance.get("userName");

            // Obtener o crear el sprint
            Map<String, Object> sprint = sprintMap.computeIfAbsent(sprintId, id -> {
                Map<String, Object> newSprint = new HashMap<>();
                newSprint.put("sprintId", sprintId);
                newSprint.put("sprintName", sprintName);
                newSprint.put("users", new ArrayList<Map<String, Object>>());
                return newSprint;
            });

            // Crear el usuario con los KPIs de compliance rate
            Map<String, Object> user = new HashMap<>();
            user.put("userId", userId);
            user.put("userName", userName);

            // Convertir los KPIs de compliance rate
            Map<String, Object> kpis = new HashMap<>();
            kpis.put("tareas_a_tiempo", ((BigDecimal) compliance.get("tareas_a_tiempo")).intValue());
            kpis.put("tareas_completadas", ((BigDecimal) compliance.get("tareas_completadas")).intValue());
            kpis.put("tareas_en_progreso", ((BigDecimal) compliance.get("tareas_en_progreso")).intValue());
            kpis.put("tareas_por_hacer", ((BigDecimal) compliance.get("tareas_por_hacer")).intValue());
            kpis.put("tareas_bloqueadas", ((BigDecimal) compliance.get("tareas_bloqueadas")).intValue());
            kpis.put("tareas_totales", ((BigDecimal) compliance.get("tareas_totales")).intValue());
            kpis.put("tasa_cumplimiento", ((BigDecimal) compliance.get("tasa_cumplimiento")).doubleValue());

            user.put("kpis", kpis);

            // Agregar el usuario al sprint
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> users = (List<Map<String, Object>>) sprint.get("users");
            users.add(user);
        }

        // Procesar estimation precision
        for (Map<String, Object> precision : estimationPrecision) {
            int sprintId = ((BigDecimal) precision.get("sprintId")).intValue();
            int userId = ((BigDecimal) precision.get("userId")).intValue();

            // Buscar el sprint y el usuario correspondiente
            Map<String, Object> sprint = sprintMap.get(sprintId);
            if (sprint != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> users = (List<Map<String, Object>>) sprint.get("users");
                for (Map<String, Object> user : users) {
                    if ((int) user.get("userId") == userId) {
                        // Agregar los KPIs de estimation precision al usuario
                        @SuppressWarnings("unchecked")
                        Map<String, Object> kpis = (Map<String, Object>) user.get("kpis");
                        kpis.put("desviacion_promedio_dias", ((BigDecimal) precision.get("desviacion_promedio_dias")).doubleValue());
                        kpis.put("desviacion_promedio_horas", ((BigDecimal) precision.get("desviacion_promedio_horas")).doubleValue());
                        kpis.put("horas_estimadas", ((BigDecimal) precision.get("horas_estimadas")).intValue());
                        kpis.put("horas_reales", ((BigDecimal) precision.get("horas_reales")).intValue());
                    }
                }
            }
        }

        // Convertir el mapa de sprints a una lista
        return new ArrayList<>(sprintMap.values());
    }
    
}
