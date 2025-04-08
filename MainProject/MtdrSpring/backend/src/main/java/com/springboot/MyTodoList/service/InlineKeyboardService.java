package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.util.InlineKeyboardHelper;
import com.springboot.MyTodoList.util.BotHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class InlineKeyboardService {

    private static final Logger logger = LoggerFactory.getLogger(InlineKeyboardService.class);

    // Método para crear teclado inline con proyectos
    public SendMessage buildProjectKeyboard(long chatId, List<Project> projects) {
        Map<String, String> projectOptions = new LinkedHashMap<>();
        for (Project project : projects) {
            projectOptions.put(String.valueOf(project.getProjectId()), project.getProjectName());
        }
        String promptText = "Para completar la acción, selecciona un PROYECTO:";
        return InlineKeyboardHelper.createInlineKeyboardMessage(chatId, promptText, projectOptions);
    }

    // Método para crear teclado inline con sprints
    public SendMessage buildSprintKeyboard(long chatId, List<Sprint> sprints) {
        Map<String, String> sprintOptions = new LinkedHashMap<>();
        for (Sprint sprint : sprints) {
            sprintOptions.put(String.valueOf(sprint.getSprintId()), sprint.getSprintName());
        }
        String promptText = "Para completar la acción, selecciona un SPRINT:";
        return InlineKeyboardHelper.createInlineKeyboardMessage(chatId, promptText, sprintOptions);
    }

    // Método para manejar el callback de botones inline
    public void handleInlineCallback(long chatId, String callbackData) {
        // Aquí se puede parsear el callbackData y actualizar la acción pendiente.
        // Por ejemplo, extraer el campo y el valor y luego delegar a otro servicio.
        logger.debug("Procesando callback inline para chat {}: {}", chatId, callbackData);
        // Implementa según tu lógica de negocio...
        BotHelper.sendMessageToTelegram(chatId, "Opción seleccionada: " + callbackData, null);
    }
}