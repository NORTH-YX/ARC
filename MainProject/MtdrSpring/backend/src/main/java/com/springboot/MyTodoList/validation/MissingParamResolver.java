package com.springboot.MyTodoList.validation;

import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.validation.ActionSchemaService.SupportedAction;

import java.util.HashMap;
import java.util.Map;

public class MissingParamResolver {

    /**
     * Genera preguntas para los campos faltantes o inválidos en la acción.
     * Devuelve un mapa: clave = nombre del campo, valor = mensaje para solicitar el dato.
     */
    public static Map<String, String> generateMissingFieldQuestions(Action action) {
        Map<String, String> questions = new HashMap<>();
        String table = inferTableFromAction(action.getAction());
        SupportedAction schema = ActionSchemaService.getActionSchema(action.getAction());
        if (schema != null) {
            for (String field : schema.getRequiredFields()) {
                Object value = action.getParams().get(field);
                if (value == null || value.toString().trim().isEmpty()) {
                    questions.put(field, "Por favor, proporciona el valor para el campo '" + field +
                                             "' en la acción '" + action.getAction() + "'.");
                } else {
                    String validated = FieldValidator.validateFieldValue(table, field, value.toString());
                    if (validated == null) {
                        questions.put(field, "El valor ingresado para '" + field +
                                                 "' es inválido. Opciones válidas: " + getValidOptions(table, field));
                    }
                }
            }
        }
        return questions;
    }

    public static String inferTableFromAction(String actionName) {
        actionName = actionName.toLowerCase();
        if (actionName.contains("task")) {
            return "TASKS";
        } else if (actionName.contains("project")) {
            return "PROJECTS";
        } else if (actionName.contains("sprint")) {
            return "SPRINTS";
        } else if (actionName.contains("user")) {
            return "USERS";
        } else if (actionName.contains("team")) {
            return "TEAMS";
        }
        return "";
    }

    private static String getValidOptions(String table, String field) {
        Map<String, java.util.List<String>> constraints = FieldValidator.tableConstraints.get(table.toUpperCase());
        if (constraints != null && constraints.containsKey(field.toUpperCase())) {
            return String.join(", ", constraints.get(field.toUpperCase()));
        }
        return "";
    }
}