package com.springboot.MyTodoList.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@Controller
public class SpaErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());

            // Si es un 404, redirige a /dashboard
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return "redirect:/dashboard";
            }
        }

        // Otros errores (500, 403, etc.)
        return "error"; // Puedes crear una página error.html si lo deseas
    }
}
