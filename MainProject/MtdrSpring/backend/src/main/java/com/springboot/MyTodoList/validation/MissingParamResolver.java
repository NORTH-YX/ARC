package com.springboot.MyTodoList.validation;

import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.validation.ActionSchemaService.SupportedAction;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;
import java.util.List;

public class MissingParamResolver {

    /**
     * Genera un prompt de corrección que incluye el JSON actual de la acción,
     * las reglas de validación (campos requeridos) y los problemas detectados.
     * Este prompt se usará para alimentar al sistema de IA o para proporcionar
     * un feedback detallado al usuario.
     */

     public static String generateCorrectionPrompt(Action action) {
        StringBuilder prompt = new StringBuilder();
        ObjectMapper mapper = new ObjectMapper();
        try {
            String actionJson = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(action);
            prompt.append("El JSON actual de la acción es:\n");
            prompt.append(actionJson);
            prompt.append("\n\n");
        } catch (Exception e) {
            prompt.append("No se pudo serializar el JSON de la acción.\n\n");
        }
        
        // Obtener tabla y esquema de la acción
        String table = inferTableFromAction(action.getAction());
        SupportedAction schema = ActionSchemaService.getActionSchema(action.getAction());
        if (schema != null) {
            prompt.append("Los campos requeridos para la acción '")
                  .append(action.getAction())
                  .append("' son:\n")
                  .append(String.join(", ", schema.getRequiredFields()))
                  .append("\n\n");
            
            prompt.append("Se detectaron los siguientes problemas:\n");
            for (String field : schema.getRequiredFields()) {
                Object value = action.getParams().get(field);
                if (value == null || value.toString().trim().isEmpty()) {
                    prompt.append("- Falta el campo '").append(field).append("'.\n");
                } else {
                    String validated = FieldValidator.validateFieldValue(table, field, value.toString());
                    if (validated == null) {
                        prompt.append("- El valor ingresado para '").append(field)
                              .append("' es inválido. Opciones válidas: ")
                              .append(getValidOptions(table, field)).append(".\n");
                    }
                }
            }
        } else {
            prompt.append("No se encontró el esquema de validación para la acción '")
                  .append(action.getAction()).append("'.\n");
        }
        prompt.append("\nPor favor, actualiza el JSON con los valores correctos.");
        return prompt.toString();
    }

    
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