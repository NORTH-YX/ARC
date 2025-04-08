package com.springboot.MyTodoList.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.dto.TaskDTO;
import com.springboot.MyTodoList.flow.CreateTaskFlowHandler;
import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.model.BotSession;
import com.springboot.MyTodoList.model.Project;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.BotSessionService;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.validation.MissingParamResolver;
import com.springboot.MyTodoList.validation.ValidatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ActionProcessorService {

    private static final Logger logger = LoggerFactory.getLogger(ActionProcessorService.class);
    private final BotSessionService botSessionService;
    private final ExternalServiceClient externalServiceClient;
    private final InlineKeyboardService inlineKeyboardService;
    private final CreateTaskFlowHandler createTaskFlowHandler;
    private final ObjectMapper mapper = new ObjectMapper();

    public ActionProcessorService(BotSessionService botSessionService,
                                  ExternalServiceClient externalServiceClient,
                                  InlineKeyboardService inlineKeyboardService,
                                  CreateTaskFlowHandler createTaskFlowHandler) {
        this.botSessionService = botSessionService;
        this.externalServiceClient = externalServiceClient;
        this.inlineKeyboardService = inlineKeyboardService;
        this.createTaskFlowHandler = createTaskFlowHandler;
    }

    // Método para obtener o actualizar la acción (incluye lógica de sesión y NLP)
    public Action obtainAction(long chatId, String messageText) {
        Optional<BotSession> sessionOpt = botSessionService.getSession(chatId);
        Action action = null;
        if (sessionOpt.isPresent()) {
            action = parseActionFromJson(sessionOpt.get().getContextJson());
            logger.debug("Acción recuperada de sesión para chat {}: {}", chatId, action);
        } else {
            action = externalServiceClient.callNlpService(messageText);
            logger.debug("Acción obtenida del NLP para chat {}: {}", chatId, action);
        }
        return action;
    }

    // Procesa la acción: valida, corrige (si es necesario) y ejecuta
    public void processNewAction(Action action, long chatId, TelegramLongPollingBot bot) {
        List<String> errors = ValidatorService.validateAction(action);
        if (!errors.isEmpty()) {
            // SPRINT_ID se delega a InlineKeyboardService
            if (action.getParams().get("SPRINT_ID") == null) {
                BotHelper.sendMessageToTelegram(chatId, "Por favor, selecciona un SPRINT.", bot);
                savePendingAction(action, chatId);
                return;
            }

            // Llamada al microservicio de corrección
            String currentActionJson = convertActionToJson(action);
            String errorSummary = String.join("\n", errors);
            String correctedJson = externalServiceClient.callCorrectionService(currentActionJson, errorSummary);
            if (correctedJson != null && !correctedJson.isEmpty()) {
                action = parseActionFromJson(correctedJson);
                logger.debug("Acción corregida: {}", action);
            } else {
                String correctionPrompt = MissingParamResolver.generateCorrectionPrompt(action);
                BotHelper.sendMessageToTelegram(chatId, correctionPrompt, bot);
                savePendingAction(action, chatId);
                return;
            }
            savePendingAction(action, chatId);
        } else {
            // Acción validada, se puede ejecutar
            executeAction(action, chatId);
        }
    }

    private void executeAction(Action action, long chatId) {
        String actionName = action.getAction().toLowerCase();
        switch (actionName) {
            case "create_task":
                try {
                    Task savedTask = createTaskFlowHandler.executeCreateTaskFlow(action.getParams());
                    String response = "Tarea creada con ID: " + savedTask.getTaskId() + " y nombre: " + savedTask.getTaskName();
                    BotHelper.sendMessageToTelegram(chatId, response, null);
                } catch (Exception e) {
                    logger.error("Error al ejecutar create_task", e);
                    BotHelper.sendMessageToTelegram(chatId, "Error al crear la tarea.", null);
                }
                break;
            // Otros casos de acciones…
            default:
                BotHelper.sendMessageToTelegram(chatId, "Acción '" + action.getAction() + "' no implementada.", null);
        }
    }

    private void savePendingAction(Action action, long chatId) {
        // Guardar la acción en BotSession para su seguimiento
        BotSession session = botSessionService.getSession(chatId).orElse(new BotSession());
        session.setChatId(chatId);
        session.setContextJson(convertActionToJson(action));
        botSessionService.saveSession(session);
    }

    // Métodos auxiliares
    private Action parseActionFromJson(String json) {
        try {
            return mapper.readValue(json, Action.class);
        } catch (Exception e) {
            logger.error("Error al parsear acción JSON", e);
            return null;
        }
    }

    private String convertActionToJson(Action action) {
        try {
            return mapper.writeValueAsString(action);
        } catch (Exception e) {
            logger.error("Error al convertir acción a JSON", e);
            return null;
        }
    }
}