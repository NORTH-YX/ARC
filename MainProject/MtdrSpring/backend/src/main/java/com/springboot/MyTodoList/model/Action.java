package com.springboot.MyTodoList.model;

import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * The Action model represents a structured command for the system.
 * It includes:
 *   - 'action': the name of the operation (e.g., "create_task")
 *   - 'params': a map of key-value parameters that define the action details.
 *
 * This model is used by both the AI-generated output and the manual user input.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class Action {

    @JsonProperty("action")
    private String action;

    @JsonProperty("params")
    private Map<String, Object> params = new HashMap<>();

    // Default constructor
    public Action() {}

    // Convenience constructor
    public Action(String action, Map<String, Object> params) {
        this.action = action;
        this.params = params;
    }

    // Getters and Setters
    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Map<String, Object> getParams() {
        return params;
    }

    public void setParams(Map<String, Object> params) {
        this.params = params;
    }

    @Override
    public String toString() {
        return "Action{" +
               "action='" + action + '\'' +
               ", params=" + params +
               '}';
    }
}