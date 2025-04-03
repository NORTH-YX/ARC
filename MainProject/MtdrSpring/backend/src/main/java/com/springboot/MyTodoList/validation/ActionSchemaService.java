package com.springboot.MyTodoList.validation;

import java.util.*;

public class ActionSchemaService {

    public static final List<SupportedAction> supportedActions = new ArrayList<>();

    static {
        // Actualizamos el esquema de create_task para incluir PROJECT_ID y SPRINT_ID
        supportedActions.add(new SupportedAction("create_task", Arrays.asList(
            "NAME", 
            "DESCRIPTION", 
            "PRIORITY", 
            "ESTIMATED_FINISH_DATE",
            "PROJECT_ID",   // agregado
            "SPRINT_ID",
            "ASSIGNED_USER_ID"     // agregado
        )));
        supportedActions.add(new SupportedAction("update_task_status", Arrays.asList("NAME", "STATUS")));
        supportedActions.add(new SupportedAction("add_comment", Arrays.asList("NAME", "COMMENT", "MENTIONS")));
        supportedActions.add(new SupportedAction("request_help", Arrays.asList("NAME")));
    }

    public static SupportedAction getActionSchema(String actionName) {
        for (SupportedAction sa : supportedActions) {
            if (sa.getName().equalsIgnoreCase(actionName)) {
                return sa;
            }
        }
        return null;
    }

    public static class SupportedAction {
        private String name;
        private List<String> requiredFields;

        public SupportedAction(String name, List<String> requiredFields) {
            this.name = name;
            this.requiredFields = requiredFields;
        }

        public String getName() {
            return name;
        }

        public List<String> getRequiredFields() {
            return requiredFields;
        }
    }
}