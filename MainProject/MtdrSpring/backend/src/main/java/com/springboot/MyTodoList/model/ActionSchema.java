package com.springboot.MyTodoList.model;

import java.util.*;

public class ActionSchema {
    public static final Map<String, List<String>> requiredFields = new HashMap<>();
    public static final Map<String, List<String>> optionalFields = new HashMap<>();

    static {
        requiredFields.put("create_task", List.of("NAME", "DESCRIPTION", "PRIORITY", "ESTIMATED_FINISH_DATE", "SPRINT_ID", "PROJECT_ID"));
        optionalFields.put("create_task", List.of("ASSIGNED_USER_ID"));

        requiredFields.put("update_task_status", List.of("TASK_ID", "STATUS"));
        requiredFields.put("assign_user_to_task", List.of("TASK_ID", "USER_ID"));
        requiredFields.put("update_task", List.of("TASK_ID"));
        optionalFields.put("update_task", List.of("NAME", "DESCRIPTION", "PRIORITY", "ESTIMATED_FINISH_DATE", "STATUS", "SPRINT_ID", "USER_ID"));
        requiredFields.put("delete_task", List.of("TASK_ID"));

        requiredFields.put("create_project", List.of("NAME", "DESCRIPTION"));
        requiredFields.put("update_project", List.of("PROJECT_ID"));
        optionalFields.put("update_project", List.of("NAME", "DESCRIPTION"));
        requiredFields.put("delete_project", List.of("PROJECT_ID"));

        requiredFields.put("create_sprint", List.of("NAME", "DESCRIPTION", "START_DATE", "END_DATE", "PROJECT_ID"));
        requiredFields.put("update_sprint", List.of("SPRINT_ID"));
        optionalFields.put("update_sprint", List.of("NAME", "DESCRIPTION", "START_DATE", "END_DATE", "STATUS"));
        requiredFields.put("delete_sprint", List.of("SPRINT_ID"));

        requiredFields.put("create_team", List.of("NAME"));
        requiredFields.put("add_user_to_team", List.of("TEAM_ID", "USER_ID"));
        requiredFields.put("create_user", List.of("USERNAME", "EMAIL", "PASSWORD"));
        requiredFields.put("create_todo", List.of("TASK_ID", "TITLE", "DESCRIPTION"));
        requiredFields.put("update_todo_status", List.of("TODO_ID", "STATUS"));
    }
    /**
     * Obtiene los campos requeridos para una acción específica.
     *
     * @param actionName Nombre de la acción.
     * @return Lista de campos requeridos.
     */
    public static List<String> getRequiredFields(String actionName) {
        return requiredFields.getOrDefault(actionName, List.of());
    }

    public static List<String> getOptionalFields(String actionName) {
        return optionalFields.getOrDefault(actionName, List.of());
    }
}
