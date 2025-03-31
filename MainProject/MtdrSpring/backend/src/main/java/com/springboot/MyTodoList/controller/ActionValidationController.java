package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.validation.MissingParamResolver;
import com.springboot.MyTodoList.validation.ValidatorService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/actions")
public class ActionValidationController {

    /**
     * Endpoint para validar una acción.
     * Recibe un objeto Action y retorna una respuesta con errores de validación y/o preguntas para campos faltantes.
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validateAction(@RequestBody Action action) {
        // Validar la acción
        List<String> errors = ValidatorService.validateAction(action);
        // Generar preguntas para los campos faltantes o inválidos
        Map<String, String> missingQuestions = MissingParamResolver.generateMissingFieldQuestions(action);

        return ResponseEntity.ok(Map.of(
                "errors", errors,
                "missingFields", missingQuestions
        ));
    }
}