package com.springboot.MyTodoList.validation;

import com.springboot.MyTodoList.model.Action;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * MissingParamResolver analyzes an Action and returns details about fields that are 
 * missing or invalid. This information is then used to continue a manual creation flow.
 */
public class MissingParamResolver {

    private static final Logger logger = LoggerFactory.getLogger(MissingParamResolver.class);

    public static class MissingFieldInfo {
        private String fieldName;
        private boolean requiresInlineKeyboard; // e.g., USER_ID, SPRINT_ID
        private String errorMessage;

        public MissingFieldInfo(String fieldName, boolean requiresInlineKeyboard, String errorMessage) {
            this.fieldName = fieldName;
            this.requiresInlineKeyboard = requiresInlineKeyboard;
            this.errorMessage = errorMessage;
            logger.debug("Created MissingFieldInfo for field '{}' - Inline required: {} - Error: {}",
                    fieldName, requiresInlineKeyboard, errorMessage);
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
        logger.debug("Starting validation for action type: {}", action.getAction());

        if ("create_task".equalsIgnoreCase(action.getAction())) {
            // Define the required fields for a create_task action
            String[] requiredFields = {
                "task_name", "description", "priority", 
                "estimated_finish_date", "sprint_id", "user_id"
            };
            for (String field : requiredFields) {
                Object val = action.getParams().get(field);
                logger.debug("Checking field '{}' with value: {}", field, val != null ? val.toString() : "null");
                if (val == null || val.toString().trim().isEmpty()) {
                    // Decide which fields require inline selection based on your existing manual flow.
                    boolean requiresInline = "sprint_id".equals(field) || "user_id".equals(field);
                    logger.debug("Field '{}' is missing or empty. Requires inline selection: {}", field, requiresInline);
                    missingFields.add(new MissingFieldInfo(field, requiresInline, "Field '" + field + "' is missing."));
                } else {
                    // Example validation for PRIORITY
                    if ("priority".equals(field)) {
                        try {
                            int prio = Integer.parseInt(val.toString());
                            if (prio < 1 || prio > 3) {
                                logger.debug("Field 'priority' has invalid value: {}", prio);
                                missingFields.add(new MissingFieldInfo(field, false, 
                                    "Invalid value for 'priority'. Acceptable values are 1, 2, or 3."));
                            }
                        } catch (NumberFormatException nfe) {
                            logger.debug("Field 'priority' is not a valid number: {}", val.toString());
                            missingFields.add(new MissingFieldInfo(field, false,
                                    "Priority must be a number (1, 2, or 3)."));
                        }
                    }
                }
            }
        } else {
            logger.debug("Action type '{}' is not handled by MissingParamResolver.", action.getAction());
        }
        logger.debug("Validation completed. Total missing/invalid fields found: {}", missingFields.size());
        return missingFields;
    }
}