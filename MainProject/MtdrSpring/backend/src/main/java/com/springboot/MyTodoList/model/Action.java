package com.springboot.MyTodoList.model;

import java.util.Map;

public class Action {
    private String action;
    private Map<String, Object> params;

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Map<String, Object> getParams() { return params; }
    public void setParams(Map<String, Object> params) { this.params = params; }
}
