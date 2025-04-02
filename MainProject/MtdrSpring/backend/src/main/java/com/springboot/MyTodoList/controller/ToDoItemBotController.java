package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;
import com.springboot.MyTodoList.validation.MissingParamResolver;
import com.springboot.MyTodoList.validation.ValidatorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.*;

@Component
public class ToDoItemBotController extends TelegramLongPollingBot {

    private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
    
    @Value("${telegram.bot.token}")
    private String telegramBotToken;

    @Value("${telegram.bot.name}")
    private String botName;

    @Value("${nlp.service.url}")
    private String nlpServiceUrl;

    private final TaskService taskService;
    private final UserService userService;
    
    // URLs base para los servicios (ajusta según corresponda)
    private static final String NLP_SERVICE_URL = "http://localhost:5000/interpret";
    private static final String PROJECTS_SERVICE_URL = "http://localhost:8080/projects";
    private static final String USERS_SERVICE_URL = "http://localhost:8080/users";
    
    // Mapa para almacenar acciones pendientes por chat (ideal para mantener el estado conversacional)
    private static final Map<Long, Action> pendingActions = new HashMap<>();
    
    private RestTemplate restTemplate = new RestTemplate();
	
    // Constructor for autowiring TaskService, UserService
    @Autowired
    public ToDoItemBotController(TaskService taskService, UserService userService) {
        super(""); // We'll override getBotToken() instead
        this.taskService = taskService;
        this.userService = userService;
    }

    @Override
    public String getBotUsername() {
        return botName;
    }

    @Override
    public String getBotToken() {
        // Return the token that was injected via @Value
        return telegramBotToken;
    }
    
    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            // Si existe una acción pendiente, se procesa la respuesta del usuario
            if (pendingActions.containsKey(chatId)) {
                processPendingActionResponse(chatId, messageText);
                return;
            }

            // Comandos para listar proyectos o usuarios
			if (messageText.equalsIgnoreCase("/list_projects")) {
				String projectsList = getProjectsList();
				BotHelper.sendMessageToTelegram(chatId, projectsList, this);
				return;
			} else if (messageText.equalsIgnoreCase("/list_users")) {
				String usersList = getUsersList();
				BotHelper.sendMessageToTelegram(chatId, usersList, this);
				return;
			}	
            
            // Si el mensaje no es un comando específico, se envía al servicio NLP real.
            // Se asume que el usuario envía un mensaje natural (por ejemplo: "Crea una tarea urgente para subir el backend mañana")
            Action action = callNLPService(messageText);
            if (action == null) {
                BotHelper.sendMessageToTelegram(chatId, "Error procesando el mensaje. Intenta nuevamente.", this);
                return;
            }
            
            // Validar la acción usando el ValidatorService
            List<String> errors = ValidatorService.validateAction(action);
            if (!errors.isEmpty()) {
                // Si hay errores o campos faltantes, generar preguntas para completarlos
                Map<String, String> questions = MissingParamResolver.generateMissingFieldQuestions(action);
                StringBuilder questionMsg = new StringBuilder("Faltan o son inválidos los siguientes campos:\n");
                questions.forEach((field, question) -> {
                    questionMsg.append(field).append(": ").append(question).append("\n");
                });
                // Almacenar la acción pendiente para este chat
                pendingActions.put(chatId, action);
                BotHelper.sendMessageToTelegram(chatId, questionMsg.toString(), this);
            } else {
                // Acción completamente validada, proceder a ejecutarla (por ejemplo, creando una tarea real en la base de datos OCI)
                executeAction(action, chatId);
            }
        }
    }
    
    /**
     * Llama al microservicio Python para interpretar el lenguaje natural.
     * Se envía un POST con el campo "input" y se espera recibir un JSON con "actions" y "summary".
     * Se toma la primera acción del array.
     */
    private Action callNLPService(String userInput) {
        try {
            logger.debug("callNLPService: Preparing to call NLP service with userInput: {}", userInput);
            Map<String, String> requestPayload = new HashMap<>();
            requestPayload.put("input", userInput);
            logger.debug("callNLPService: Request payload: {}", requestPayload);
    
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestPayload, headers);
    
            logger.debug("callNLPService: Sending POST request to NLP service at URL: {}", nlpServiceUrl);
            ResponseEntity<Map> response = restTemplate.postForEntity(nlpServiceUrl, requestEntity, Map.class);
            logger.debug("callNLPService: Received response with status: {}", response.getStatusCode());
            
            if (response.getStatusCode() == HttpStatus.OK) {
                Map body = response.getBody();
                logger.debug("callNLPService: Response body: {}", body);
                
                List<Map<String, Object>> actionsList = (List<Map<String, Object>>) body.get("actions");
                logger.debug("callNLPService: Actions list: {}", actionsList);
                
                if (actionsList != null && !actionsList.isEmpty()) {
                    Map<String, Object> actionMap = actionsList.get(0);
                    logger.debug("callNLPService: First action map: {}", actionMap);
                    
                    Action action = new Action();
                    action.setAction((String) actionMap.get("action"));
                    action.setParams((Map<String, Object>) actionMap.get("params"));
                    logger.debug("callNLPService: Parsed action: {}", action);
                    
                    return action;
                } else {
                    logger.warn("callNLPService: Actions list is null or empty");
                }
            } else {
                logger.warn("callNLPService: Response status is not OK: {}", response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error al llamar al servicio NLP", e);
        }
        return null;
    }
    
    /**
     * Realiza una petición GET al servicio de proyectos para obtener la lista real.
     */
    private String getProjectsList() {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    PROJECTS_SERVICE_URL,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> projects = response.getBody();
                StringBuilder sb = new StringBuilder("Lista de Proyectos:\n");
                for (Map<String, Object> project : projects) {
                    sb.append(project.get("id")).append(": ").append(project.get("name")).append("\n");
                }
                return sb.toString();
            }
        } catch (Exception e) {
            logger.error("Error al obtener la lista de proyectos", e);
        }
        return "No se pudieron obtener los proyectos.";
    }
    
    /**
     * Realiza una petición GET al servicio de usuarios para obtener la lista real.
     */
    private String getUsersList() {
        try {
            ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                    USERS_SERVICE_URL,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<Map<String, Object>>>() {});
            if (response.getStatusCode() == HttpStatus.OK) {
                List<Map<String, Object>> users = response.getBody();
                StringBuilder sb = new StringBuilder("Lista de Usuarios:\n");
                for (Map<String, Object> user : users) {
                    sb.append(user.get("id")).append(": ").append(user.get("name")).append("\n");
                }
                return sb.toString();
            }
        } catch (Exception e) {
            logger.error("Error al obtener la lista de usuarios", e);
        }
        return "No se pudieron obtener los usuarios.";
    }
    
    /**
     * Procesa la respuesta del usuario para una acción pendiente.
     * Se espera que el usuario responda en el formato "FIELD:valor"
     */
    private void processPendingActionResponse(long chatId, String messageText) {
        Action pendingAction = pendingActions.get(chatId);
        String[] parts = messageText.split(":", 2);
        if (parts.length < 2) {
            BotHelper.sendMessageToTelegram(chatId, "Formato incorrecto. Usa FIELD:valor", this);
            return;
        }
        String field = parts[0].trim().toUpperCase();
        String value = parts[1].trim();
        pendingAction.getParams().put(field, value);
        List<String> errors = ValidatorService.validateAction(pendingAction);
        if (!errors.isEmpty()) {
            Map<String, String> questions = MissingParamResolver.generateMissingFieldQuestions(pendingAction);
            StringBuilder questionMsg = new StringBuilder("Aún faltan o son inválidos los siguientes campos:\n");
            questions.forEach((f, q) -> questionMsg.append(f).append(": ").append(q).append("\n"));
            pendingActions.put(chatId, pendingAction);
            BotHelper.sendMessageToTelegram(chatId, questionMsg.toString(), this);
        } else {
            pendingActions.remove(chatId);
            executeAction(pendingAction, chatId);
        }
    }
    
    /**
     * Ejecuta la acción validada.
     * Aquí debes integrar la lógica real para crear, actualizar o ejecutar la acción en la base de datos OCI.
     */
    private void executeAction(Action action, long chatId) {
        // Ejemplo: para "create_task", se llamaría a TaskService.addTask(...) o similar.
        // Por ahora, confirmamos la acción con un mensaje.
        String response = "Acción '" + action.getAction() + "' ejecutada correctamente con parámetros: " + action.getParams();
        BotHelper.sendMessageToTelegram(chatId, response, this);
    }


}