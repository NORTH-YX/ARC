package com.springboot.MyTodoList.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.service.ToDoItemService;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.service.ActionProcessorService;
import com.springboot.MyTodoList.service.BotSessionService;
import com.springboot.MyTodoList.service.InlineKeyboardService;
import com.springboot.MyTodoList.service.ProjectService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.ExternalServiceClient;
import com.springboot.MyTodoList.dto.TaskDTO;
import com.springboot.MyTodoList.flow.CreateTaskFlowHandler;
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
import java.time.OffsetDateTime;

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

    @Value("${correction.service.url}")
    private String correctionServiceUrl;

    private final TaskService taskService;
    private final UserService userService;
    private final ProjectService projectService;
    private final SprintService sprintService;
    private final ExternalServiceClient externalServiceClient;

    // Constantes locales para los endpoints
    private static final String NLP_SERVICE_URL = "http://localhost:5000/interpret";
    private static final String PROJECTS_SERVICE_URL = "http://localhost:8080/projects";
    private static final String USERS_SERVICE_URL = "http://localhost:8080/users";
         
    
    // Mapa para almacenar acciones pendientes por chat (ideal para mantener el estado conversacional)
    private static final Map<Long, Action> pendingActions = new HashMap<>();
    
    private RestTemplate restTemplate = new RestTemplate();

    @Autowired
    private BotSessionService botSessionService;

    @Autowired
    private CreateTaskFlowHandler createTaskFlowHandler;

    @Autowired
   private ActionProcessorService actionProcessorService;

    @Autowired
    private InlineKeyboardService inlineKeyboardService;    
	
    // Constructor for autowiring TaskService, UserService, ProjectService and SprintService
    @Autowired
    public ToDoItemBotController(TaskService taskService, UserService userService, 
                                 ProjectService projectService, SprintService sprintService,
                                 ExternalServiceClient externalServiceClient) {
        super(""); 
        this.taskService = taskService;
        this.userService = userService;
        this.projectService = projectService;
        this.sprintService = sprintService;
        this.externalServiceClient = externalServiceClient;
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
        // Los botones en línea (inline buttons) son manejados aquí
        // Si el update tiene un callback_query, significa que se presionó un botón en línea
        if (update.hasCallbackQuery()) {
            String callbackData = update.getCallbackQuery().getData();
            long chatId = update.getCallbackQuery().getMessage().getChatId();
            inlineKeyboardService.handleInlineCallback(chatId, callbackData);
            return;
        }

        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            // Delegar la obtención de la acción (incluye sesión y llamada NLP)
            Action action = actionProcessorService.obtainAction(chatId, messageText);
            if (action == null) {
                BotHelper.sendMessageToTelegram(chatId, "Error procesando el mensaje. Intenta nuevamente.", this);
                return;
            }
            
            // Delegar el procesamiento de la acción
            actionProcessorService.processNewAction(action, chatId, this);
        }
    }
}