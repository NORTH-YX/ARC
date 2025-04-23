package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "           AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "           AND t.real_finish_date IS NOT NULL THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END) AS tareas_en_progreso, " +
                "COUNT(CASE WHEN t.status = 'To Do' THEN 1 END) AS tareas_por_hacer, " +
                "COUNT(CASE WHEN t.status = 'Blocked' THEN 1 END) AS tareas_bloqueadas, " +
                "COUNT(*) AS tareas_totales, " +
                "ROUND(CASE WHEN COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                           OR t.real_finish_date IS NOT NULL THEN 1 END) > 0 " +
                "     THEN COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "                    AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    AND t.real_finish_date IS NOT NULL THEN 1 END) * 100.0 / " +
                "          COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    OR t.real_finish_date IS NOT NULL THEN 1 END) " +
                "     ELSE 0 END, 2) AS tasa_cumplimiento, " +
                "SUM(t.estimated_hours) AS horas_estimadas, " +
                "SUM(t.real_hours) AS horas_reales " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.users u ON t.user_id = u.user_id " +
                "WHERE t.status IN ('Completed', 'In Progress', 'To Do', 'Blocked') " +
                "GROUP BY u.user_id, u.name",
        nativeQuery = true
    )
    List<Map<String, Object>> getUserComplianceRate(@Param("fechaConsulta") String fechaConsulta);
    
    
    @Query(
        value = "SELECT p.project_id AS id, p.project_name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "           AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "           AND t.real_finish_date IS NOT NULL THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END) AS tareas_en_progreso, " +
                "COUNT(CASE WHEN t.status = 'To Do' THEN 1 END) AS tareas_por_hacer, " +
                "COUNT(CASE WHEN t.status = 'Blocked' THEN 1 END) AS tareas_bloqueadas, " +
                "COUNT(*) AS tareas_totales, " +
                "ROUND(CASE WHEN COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                           OR t.real_finish_date IS NOT NULL THEN 1 END) > 0 " +
                "     THEN COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "                    AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    AND t.real_finish_date IS NOT NULL THEN 1 END) * 100.0 / " +
                "          COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    OR t.real_finish_date IS NOT NULL THEN 1 END) " +
                "     ELSE 0 END, 2) AS tasa_cumplimiento, " +
                "SUM(t.estimated_hours) AS horas_estimadas, " +
                "SUM(t.real_hours) AS horas_reales " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.projects p ON p.project_id = p.project_id " +
                "WHERE t.status IN ('Completed', 'In Progress', 'To Do', 'Blocked') " +
                "GROUP BY p.project_id, p.project_name",
        nativeQuery = true
    )
    List<Map<String, Object>> getProjectComplianceRate(@Param("fechaConsulta") String fechaConsulta);
    
    
    @Query(
        value = "SELECT s.sprint_id AS id, s.sprint_name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "           AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "           AND t.real_finish_date IS NOT NULL THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END) AS tareas_en_progreso, " +
                "COUNT(CASE WHEN t.status = 'To Do' THEN 1 END) AS tareas_por_hacer, " +
                "COUNT(CASE WHEN t.status = 'Blocked' THEN 1 END) AS tareas_bloqueadas, " +
                "COUNT(*) AS tareas_totales, " +
                "ROUND(CASE WHEN COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                           OR t.real_finish_date IS NOT NULL THEN 1 END) > 0 " +
                "     THEN COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "                    AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    AND t.real_finish_date IS NOT NULL THEN 1 END) * 100.0 / " +
                "          COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    OR t.real_finish_date IS NOT NULL THEN 1 END) " +
                "     ELSE 0 END, 2) AS tasa_cumplimiento, " +
                "SUM(t.estimated_hours) AS horas_estimadas, " +
                "SUM(t.real_hours) AS horas_reales " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.sprints s ON t.sprint_id = s.sprint_id " +
                "WHERE t.status IN ('Completed', 'In Progress', 'To Do', 'Blocked') " +
                "GROUP BY s.sprint_id, s.sprint_name",
        nativeQuery = true
    )
    List<Map<String, Object>> getSprintComplianceRate(@Param("fechaConsulta") String fechaConsulta);
    

    @Query(
        value = "SELECT u.user_id AS id, " +
                "u.name AS name, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
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
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
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
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
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

    //ddddddddddddd

    @Query(
        value = "SELECT u.user_id AS id, u.name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "           AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "           AND t.real_finish_date IS NOT NULL THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END) AS tareas_en_progreso, " +
                "COUNT(CASE WHEN t.status = 'To Do' THEN 1 END) AS tareas_por_hacer, " +
                "COUNT(CASE WHEN t.status = 'Blocked' THEN 1 END) AS tareas_bloqueadas, " +
                "COUNT(*) AS tareas_totales, " +
                "ROUND(CASE WHEN COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                           OR t.real_finish_date IS NOT NULL THEN 1 END) > 0 " +
                "     THEN COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "                    AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    AND t.real_finish_date IS NOT NULL THEN 1 END) * 100.0 / " +
                "          COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    OR t.real_finish_date IS NOT NULL THEN 1 END) " +
                "     ELSE 0 END, 2) AS tasa_cumplimiento " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.users u ON t.user_id = u.user_id " +
                "WHERE t.user_id = :userId " +
                "AND t.status IN ('Completed', 'In Progress', 'To Do', 'Blocked') " +
                "GROUP BY u.user_id, u.name",
        nativeQuery = true
    )
    List<Map<String, Object>> getUserComplianceRateById(@Param("userId") int userId, @Param("fechaConsulta") String fechaConsulta);
    

    @Query(
        value = "SELECT s.sprint_id AS id, s.sprint_name AS name, " +
                "COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "           AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "           AND t.real_finish_date IS NOT NULL " +
                "           AND t.status = 'Completed' THEN 1 END) AS tareas_a_tiempo, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "COUNT(CASE WHEN t.status = 'In Progress' THEN 1 END) AS tareas_en_progreso, " +
                "COUNT(CASE WHEN t.status = 'To Do' THEN 1 END) AS tareas_por_hacer, " +
                "COUNT(CASE WHEN t.status = 'Blocked' THEN 1 END) AS tareas_bloqueadas, " +
                "COUNT(*) AS tareas_totales, " +
                "ROUND(CASE WHEN COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                           AND t.real_finish_date IS NOT NULL " +
                "                           AND t.status = 'Completed' THEN 1 END) > 0 " +
                "     THEN COUNT(CASE WHEN t.real_finish_date <= t.estimated_finish_date " +
                "                    AND t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    AND t.real_finish_date IS NOT NULL " +
                "                    AND t.status = 'Completed' THEN 1 END) * 100.0 / " +
                "          COUNT(CASE WHEN t.estimated_finish_date <= TO_DATE(:fechaConsulta, 'YYYY-MM-DD HH24:MI:SS') " +
                "                    AND t.real_finish_date IS NOT NULL " +
                "                    AND t.status = 'Completed' THEN 1 END) " +
                "     ELSE 0 END, 2) AS tasa_cumplimiento " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.sprints s ON t.sprint_id = s.sprint_id " +
                "WHERE t.status IN ('Completed', 'In Progress', 'To Do', 'Blocked') " +
                "AND s.sprint_id = :sprintId " +
                "GROUP BY s.sprint_id, s.sprint_name",
        nativeQuery = true
    )
    List<Map<String, Object>> getSprintComplianceRateById(@Param("sprintId") int sprintId, @Param("fechaConsulta") String fechaConsulta);
    

    @Query(
        value = "SELECT u.user_id AS id, " +
                "u.name AS name, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "ROUND(AVG(CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)), 2) AS desviacion_promedio_dias, " +
                "ROUND(AVG((CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)) * 24), 2) AS desviacion_promedio_horas, " + // Coma agregada aquí
                "SUM(t.estimated_hours) AS horas_estimadas, " +
                "SUM(t.real_hours) AS horas_reales " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.users u ON t.user_id = u.user_id " +
                "WHERE t.user_id = :userId " +
                "AND t.status = 'Completed' " +
                "AND t.real_finish_date IS NOT NULL " +
                "AND t.estimated_finish_date IS NOT NULL " +
                "GROUP BY u.user_id, u.name",
        nativeQuery = true
    )
    List<Map<String, Object>> getUserEstimationPrecisionById(@Param("userId") int userId);

    @Query(
        value = "SELECT s.sprint_id AS id, " +
                "s.sprint_name AS name, " +
                "COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tareas_completadas, " +
                "ROUND(AVG(CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)), 2) AS desviacion_promedio_dias, " +
                "ROUND(AVG((CAST(t.real_finish_date AS DATE) - CAST(t.estimated_finish_date AS DATE)) * 24), 2) AS desviacion_promedio_horas, " + // Coma agregada aquí
                "SUM(t.estimated_hours) AS horas_estimadas, " +
                "SUM(t.real_hours) AS horas_reales " +
                "FROM TODOUSER.tasks t " +
                "JOIN TODOUSER.sprints s ON t.sprint_id = s.sprint_id " +
                "WHERE t.sprint_id = :sprintId " +
                "AND t.status = 'Completed' " +
                "AND t.real_finish_date IS NOT NULL " +
                "AND t.estimated_finish_date IS NOT NULL " +
                "GROUP BY s.sprint_id, s.sprint_name",
        nativeQuery = true
    )
    List<Map<String, Object>> getSprintEstimationPrecisionById(@Param("sprintId") int sprintId);

}