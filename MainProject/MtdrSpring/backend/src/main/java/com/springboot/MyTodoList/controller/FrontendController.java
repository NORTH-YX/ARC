package com.springboot.MyTodoList.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    // Acepta rutas fijas y dinámicas del frontend, excepto /api y recursos estáticos
    @RequestMapping(value = {
        "/", 
        "/dashboard", 
        "/profile", 
        "/login", 
        "/register",
        "/projects",
        "/teams",
        "/reports",
        "/projectDashboard/**"
    })
    public String forwardFrontendRoutes() {
        return "forward:/index.html";
    }
}
