package com.springboot.MyTodoList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import com.springboot.MyTodoList.controller.ToDoItemBotController;
import com.springboot.MyTodoList.util.BotMessages;
import com.springboot.MyTodoList.service.*;

@SpringBootApplication
public class MyTodoListApplication implements CommandLineRunner {

	private static final Logger logger = LoggerFactory.getLogger(MyTodoListApplication.class);

	@Autowired
	private TaskService taskService;

	@Autowired
	private ProjectService projectService;

	@Autowired
	private UserService userService;

	@Autowired
	private SprintService SprintService;

	@Value("${telegram.bot.token}")
	private String telegramBotToken;

	@Value("${telegram.bot.name}")
	private String botName;

	public static void main(String[] args) {
		SpringApplication.run(MyTodoListApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Verificar si se debe ejecutar el bot
		String runBot = System.getenv("RUN_TELEGRAM_BOT"); // Leer la variable de entorno
		if ("true".equalsIgnoreCase(runBot)) {
			try {
				TelegramBotsApi telegramBotsApi = new TelegramBotsApi(DefaultBotSession.class);
				telegramBotsApi.registerBot(new ToDoItemBotController(telegramBotToken, botName, taskService,
						userService, SprintService));
				logger.info(BotMessages.BOT_REGISTERED_STARTED.getMessage());
			} catch (TelegramApiException e) {
				logger.error("Error starting Telegram bot: " + e.getMessage(), e);
			}
		} else {
			logger.info("Telegram bot is disabled. Set RUN_TELEGRAM_BOT=true to enable it.");
		}
	}
}
