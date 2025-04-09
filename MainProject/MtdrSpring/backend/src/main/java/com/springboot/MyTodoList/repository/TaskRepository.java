package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.Map;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    Optional<Task> findByTaskName(String taskName);

    List<Task> findByUserId(User userId);
    List<Task> findBySprintId(Sprint sprintId);
    List<Task> findByPriority(Integer priority);
    List<Task> findByStatus(String status);

    @Query(
        value = "SELECT u.user_id AS id, u.name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(*) AS tareas_completadas, " +
                "ROUND(COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date THEN 1 END) * 100.0 / COUNT(*), 2) AS tasa_cumplimiento " +
                "FROM TODOUSER.tasks t " +
                "JOIN todouser.users u ON t.user_id = u.user_id " +
                "WHERE t.status = 'Completed' " +
                "GROUP BY u.user_id, u.name",
        nativeQuery = true)
    List<Map<String, Object>> getUserComplianceRate();

    @Query(
        value = "SELECT p.project_id AS id, p.project_name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(*) AS tareas_completadas, " +
                "ROUND(COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date THEN 1 END) * 100.0 / COUNT(*), 2) AS tasa_cumplimiento " +
                "FROM TODOUSER.tasks t " +
                "JOIN todouser.projects p ON p.project_id = p.project_id " +
                "WHERE t.status = 'Completed' " +
                "GROUP BY p.project_id, p.project_name",
        nativeQuery = true)
    List<Map<String, Object>> getProjectComplianceRate();

    @Query(
        value = "SELECT s.sprint_id AS id, s.sprint_name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(*) AS tareas_completadas, " +
                "ROUND(COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date THEN 1 END) * 100.0 / COUNT(*), 2) AS tasa_cumplimiento " +
                "FROM TODOUSER.tasks t " +
                "JOIN todouser.sprints s ON t.sprint_id = s.sprint_id " +
                "WHERE t.status = 'Completed' " +
                "GROUP BY s.sprint_id, s.sprint_name",
        nativeQuery = true)
    List<Map<String, Object>> getSprintComplianceRate();

    @Query(
        value = "SELECT u.user_id AS id, " +
                "u.name AS name, " +
                "COUNT(*) AS tareas_completadas, " +
                "ROUND(AVG(CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)), 2) AS desviacion_promedio_dias, " +
                "ROUND(AVG((CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)) * 24), 2) AS desviacion_promedio_horas " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.users u ON t.user_id = u.user_id " +
                "WHERE t.status = 'Completed' " +
                "AND t.real_finish_date IS NOT NULL " +
                "AND t.estimated_finish_date IS NOT NULL " +
                "GROUP BY u.user_id, u.name",
        nativeQuery = true)
    List<Map<String, Object>> getUserEstimationPrecision();

    @Query(
        value = "SELECT p.project_id AS id, " +
                "p.project_name AS name, " +
                "COUNT(*) AS tareas_completadas, " +
                "ROUND(AVG(CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)), 2) AS desviacion_promedio_dias, " +
                "ROUND(AVG((CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)) * 24), 2) AS desviacion_promedio_horas " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.projects p ON p.project_id = p.project_id " +
                "WHERE t.status = 'Completed' " +
                "AND t.real_finish_date IS NOT NULL " +
                "AND t.estimated_finish_date IS NOT NULL " +
                "GROUP BY p.project_id, p.project_name",
        nativeQuery = true)
    List<Map<String, Object>> getProjectEstimationPrecision();

    @Query(
        value = "SELECT s.sprint_id AS id, " +
                "s.sprint_name AS name, " +
                "COUNT(*) AS tareas_completadas, " +
                "ROUND(AVG(CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)), 2) AS desviacion_promedio_dias, " +
                "ROUND(AVG((CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)) * 24), 2) AS desviacion_promedio_horas " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.sprints s ON t.sprint_id = s.sprint_id " +
                "WHERE t.status = 'Completed' " +
                "AND t.real_finish_date IS NOT NULL " +
                "AND t.estimated_finish_date IS NOT NULL " +
                "GROUP BY s.sprint_id, s.sprint_name",
        nativeQuery = true)
    List<Map<String, Object>> getSprintEstimationPrecision();

}