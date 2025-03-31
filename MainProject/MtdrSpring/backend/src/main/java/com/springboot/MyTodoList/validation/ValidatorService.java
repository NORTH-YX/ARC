package com.springboot.MyTodoList.validation;

import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.validation.ActionSchemaService.SupportedAction;

import java.util.ArrayList;
import java.util.List;

public class ValidatorService {

    /**
     * Valida que la acción contenga todos los campos requeridos y que los valores sean válidos.
     * Devuelve una lista de errores (mensajes de validación). Si la lista está vacía, la acción es válida.
     */
    public static List<String> validateAction(Action action) {
        List<String> errors = new ArrayList<>();
        String table = MissingParamResolver.inferTableFromAction(action.getAction());
        SupportedAction schema = ActionSchemaService.getActionSchema(action.getAction());
        if (schema != null) {
            for (String field : schema.getRequiredFields()) {
                Object val = action.getParams().get(field);
                if (val == null || val.toString().trim().isEmpty()) {
                    if (FieldValidator.isFieldRequired(table, field) && !FieldValidator.isFieldNullable(table, field)) {
                        errors.add("El campo '" + field + "' es obligatorio y no puede estar vacío.");
                    }
                } else {
                    String validated = FieldValidator.validateFieldValue(table, field, val.toString());
                    if (validated == null) {
                        errors.add("El valor ingresado para '" + field + "' es inválido.");
                    }
                }
            }
        } else {
            errors.add("No se encontró el esquema para la acción '" + action.getAction() + "'.");
        }
        return errors;
    }
}