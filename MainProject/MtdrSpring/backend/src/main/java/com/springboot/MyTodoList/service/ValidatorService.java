package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.validation.MissingParamResolver;
import com.springboot.MyTodoList.model.Action;
import java.util.ArrayList;
import java.util.List;

public class ValidatorService {

    /**
     * Validates the action and returns a list of error messages if fields are missing/invalid.
     */
    public static List<String> validateAction(Action action) {
        List<MissingParamResolver.MissingFieldInfo> issues = MissingParamResolver.getMissingOrInvalidFields(action);
        List<String> errors = new ArrayList<>();
        for (MissingParamResolver.MissingFieldInfo issue : issues) {
            errors.add(issue.getErrorMessage());
        }
        return errors;
    }
}