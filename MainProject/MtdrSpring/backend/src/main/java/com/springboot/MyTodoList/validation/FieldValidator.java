package com.springboot.MyTodoList.validation;

import java.time.Instant;
import java.util.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class FieldValidator {

    // Definir las restricciones de valores por tabla y campo
    public static final Map<String, Map<String, List<String>>> tableConstraints = new HashMap<>();
    // Campos obligatorios
    public static final Map<String, List<String>> requiredFieldsByTable = new HashMap<>();
    // Campos que pueden ser nulos
    public static final Map<String, List<String>> nullableFieldsByTable = new HashMap<>();
    // Campos de tipo fecha (timestamp)
    public static final Map<String, List<String>> datetimeFieldsByTable = new HashMap<>();

    static {
        // TABLE CONSTRAINTS
        Map<String, List<String>> tasksConstraints = new HashMap<>();
        tasksConstraints.put("STATUS", Arrays.asList("To Do", "in progress", "completed"));
        tasksConstraints.put("PRIORITY", Arrays.asList("1", "2", "3"));
        tableConstraints.put("TASKS", tasksConstraints);

        Map<String, List<String>> projectsConstraints = new HashMap<>();
        projectsConstraints.put("STATUS", Arrays.asList("To Do", "in progress", "completed"));
        tableConstraints.put("PROJECTS", projectsConstraints);

        Map<String, List<String>> sprintsConstraints = new HashMap<>();
        sprintsConstraints.put("STATUS", Arrays.asList("To Do", "in progress", "completed"));
        tableConstraints.put("SPRINTS", sprintsConstraints);

        Map<String, List<String>> usersConstraints = new HashMap<>();
        usersConstraints.put("ROLE", Arrays.asList("admin", "developer", "manager"));
        usersConstraints.put("WORK_MODALITY", Arrays.asList("remote", "hybrid", "on-site"));
        tableConstraints.put("USERS", usersConstraints);

        // CAMPOS REQUERIDOS
        requiredFieldsByTable.put("TASKS", Arrays.asList("TASK_NAME", "DESCRIPTION", "PRIORITY", "STATUS", "USER_ID", "SPRINT_ID"));
        requiredFieldsByTable.put("PROJECTS", Arrays.asList("PROJECT_NAME", "DESCRIPTION", "STATUS", "START_DATE"));
        requiredFieldsByTable.put("SPRINTS", Arrays.asList("SPRINT_NAME", "START_DATE", "FINISH_DATE", "STATUS"));
        requiredFieldsByTable.put("USERS", Arrays.asList("NAME", "EMAIL", "ROLE", "WORK_MODALITY", "PASSWORD"));
        requiredFieldsByTable.put("TEAMS", Arrays.asList("TEAM_NAME", "PROJECT_ID"));

        // CAMPOS QUE PUEDEN SER NULOS
        nullableFieldsByTable.put("PROJECTS", Arrays.asList("DELETED_AT", "REAL_FINISH_DATE", "ESTIMATED_HOURS", "REAL_HOURS"));
        nullableFieldsByTable.put("SPRINTS", Arrays.asList("DELETED_AT"));
        nullableFieldsByTable.put("TASKS", Arrays.asList("DELETED_AT", "REAL_FINISH_DATE", "REAL_HOURS"));
        nullableFieldsByTable.put("USERS", Arrays.asList("TELEGRAM_ID", "PHONE_NUMBER", "TEAM_ID", "DELETED_AT"));

        // CAMPOS DE TIPO FECHA
        datetimeFieldsByTable.put("TASKS", Arrays.asList("ESTIMATED_FINISH_DATE", "REAL_FINISH_DATE", "CREATION_DATE"));
        datetimeFieldsByTable.put("PROJECTS", Arrays.asList("START_DATE", "ESTIMATED_FINISH_DATE", "REAL_FINISH_DATE"));
        datetimeFieldsByTable.put("SPRINTS", Arrays.asList("START_DATE", "FINISH_DATE"));
        datetimeFieldsByTable.put("USERS", Arrays.asList("CREATION_DATE"));
        datetimeFieldsByTable.put("TEAMS", Arrays.asList("CREATION_DATE"));
    }

    /**
     * Valida el valor de un campo para una tabla dada.
     * Si el campo es de tipo fecha, se intenta parsearlo a formato ISO.
     * Si el campo tiene restricciones (ENUM), se verifica que el valor sea uno de los válidos.
     * Devuelve el valor normalizado o null si es inválido.
     */
    public static String validateFieldValue(String table, String field, String value) {
        table = table.toUpperCase();
        field = field.toUpperCase();

        // Validar campo de tipo fecha
        if (isDatetimeField(table, field)) {
            try {
                // Intentar parsear directamente en formato ISO_INSTANT (ej: 2025-04-03T20:06:10Z)
                Instant instant = Instant.parse(value);
                return instant.toString();
            } catch (DateTimeParseException e) {
                try {
                    // Si falla, intentar parsearlo como LocalDateTime (ej: 2025-04-03T20:06:10)
                    LocalDateTime ldt = LocalDateTime.parse(value, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                    // Asumir que es UTC; si se requiere otra zona, modificar aquí
                    Instant instant = ldt.atZone(ZoneOffset.UTC).toInstant();
                    return instant.toString();
                } catch (DateTimeParseException ex) {
                    System.out.println("⚠️ No se reconoció '" + value + "' como fecha válida para " + table + "." + field);
                    return null;
                }
            }
        }

        // Integrar la conversión de PRIORITY para la tabla TASKS.
        // Si se recibe un valor textual, se convierte a su representación numérica.
        if (table.equals("TASKS") && field.equals("PRIORITY")) {
            if (value.equalsIgnoreCase("low") || value.equalsIgnoreCase("baja")) {
                value = "1";
            } else if (value.equalsIgnoreCase("medium") || value.equalsIgnoreCase("media")) {
                value = "2";
            } else if (value.equalsIgnoreCase("high") || value.equalsIgnoreCase("alta") || value.equalsIgnoreCase("urgent") || value.equalsIgnoreCase("urgente")) {
                value = "3";
            }
        }

        // Validar restricciones tipo ENUM
        Map<String, List<String>> constraints = tableConstraints.get(table);
        if (constraints == null || !constraints.containsKey(field)) {
            return value; // Sin restricciones especiales
        }

        List<String> validOptions = constraints.get(field);
        for (String option : validOptions) {
            if (value.equalsIgnoreCase(option)) {
                return option;
            }
        }
        System.out.println("⚠️ Valor inválido para " + table + "." + field + ": '" + value +
                        "'. Opciones válidas: " + String.join(", ", validOptions));
        return null;
    }

    public static boolean isFieldRequired(String table, String field) {
        table = table.toUpperCase();
        field = field.toUpperCase();
        List<String> required = requiredFieldsByTable.get(table);
        return required != null && required.contains(field);
    }

    public static boolean isFieldNullable(String table, String field) {
        table = table.toUpperCase();
        field = field.toUpperCase();
        List<String> nullable = nullableFieldsByTable.get(table);
        return nullable != null && nullable.contains(field);
    }

    public static boolean isDatetimeField(String table, String field) {
        table = table.toUpperCase();
        field = field.toUpperCase();
        List<String> dateFields = datetimeFieldsByTable.get(table);
        return dateFields != null && dateFields.contains(field);
    }
}