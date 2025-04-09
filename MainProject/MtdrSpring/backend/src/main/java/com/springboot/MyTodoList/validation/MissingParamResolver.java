package com.springboot.MyTodoList.validation;

import com.springboot.MyTodoList.model.Action;
import java.util.ArrayList;
import java.util.List;

/**
 * MissingParamResolver analyzes an Action and returns details about fields that are 
 * missing or invalid. This information is then used to continue a manual creation flow.
 */
public class MissingParamResolver {

    public static class MissingFieldInfo {
        private String fieldName;
        private boolean requiresInlineKeyboard; // e.g., USER_ID, SPRINT_ID
        private String errorMessage;

        public MissingFieldInfo(String fieldName, boolean requiresInlineKeyboard, String errorMessage) {
            this.fieldName = fieldName;
            this.requiresInlineKeyboard = requiresInlineKeyboard;
            this.errorMessage = errorMessage;
        }

        public String getFieldName() {
            return fieldName;
        }

        public boolean isRequiresInlineKeyboard() {
            return requiresInlineKeyboard;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    /**
     * Returns a list of MissingFieldInfo items describing missing/invalid fields in the action.
     */
    public static List<MissingFieldInfo> getMissingOrInvalidFields(Action action) {
        List<MissingFieldInfo> missingFields = new ArrayList<>();

        if ("create_task".equalsIgnoreCase(action.getAction())) {
            // Define the required fields for a create_task action
            String[] requiredFields = {
                "TASK_NAME", "DESCRIPTION", "PRIORITY", 
                "ESTIMATED_FINISH_DATE", "SPRINT_ID", "USER_ID"
            };
            for (String field : requiredFields) {
                Object val = action.getParams().get(field);
                if (val == null || val.toString().trim().isEmpty()) {
                    // Decide which fields require inline selection based on your existing manual flow.
                    boolean requiresInline = "SPRINT_ID".equals(field) || "USER_ID".equals(field);
                    missingFields.add(new MissingFieldInfo(field, requiresInline, "Field '" + field + "' is missing."));
                } else {
                    // Example validation for PRIORITY
                    if ("PRIORITY".equals(field)) {
                        try {
                            int prio = Integer.parseInt(val.toString());
                            if (prio < 1 || prio > 3) {
                                missingFields.add(new MissingFieldInfo(field, false, 
                                    "Invalid value for 'PRIORITY'. Acceptable values are 1, 2, or 3."));
                            }
                        } catch (NumberFormatException nfe) {
                            missingFields.add(new MissingFieldInfo(field, false,
                                    "Priority must be a number (1, 2, or 3)."));
                        }
                    }
                }
            }
        }
        return missingFields;
    }
}