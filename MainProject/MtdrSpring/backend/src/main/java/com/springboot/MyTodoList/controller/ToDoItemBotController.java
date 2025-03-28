package com.springboot.MyTodoList.controller;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.format.DateTimeFormatter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class ToDoItemBotController extends TelegramLongPollingBot {

	private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
	private TaskService taskService;
	private UserService userService;
	private String botName;
	private Map<Long, Boolean> userWelcomeState = new HashMap<>();

	public ToDoItemBotController(String botToken, String botName, TaskService taskService, UserService userService) {
		super(botToken);
		logger.info("Bot Token: " + botToken);
		logger.info("Bot name: " + botName);
		this.taskService = taskService;
		this.userService = userService;
		this.botName = botName;
	}

	@Override
	public void onUpdateReceived(Update update) {

		if (update.hasMessage() && update.getMessage().hasText()) {

			String messageTextFromTelegram = update.getMessage().getText();
			long chatId = update.getMessage().getChatId();

			User u = validateChatIdAndGetUserData(chatId);
        	if (u != null) {
            	// Check if the welcome message has already been sent
            	if (!userWelcomeState.containsKey(chatId) || !userWelcomeState.get(chatId)) {
                	// Display the user's name in the bot
                	String welcomeMessage = "Welcome, " + u.getName() + "! 👋";
                	BotHelper.sendMessageToTelegram(chatId, welcomeMessage, this);

                	// LAST INSTRUCTION: Mark the user as welcomed
                	userWelcomeState.put(chatId, true);
				}
			} else {
            	// If no user is found, prompt them to register
            	String errorMessage = "User not found. Please register to use the bot.";
            	BotHelper.sendMessageToTelegram(chatId, errorMessage, this);
            	return; // Stop further processing if the user is not found
        	}

			if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {
				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText(BotMessages.HELLO_MYTODO_BOT.getMessage());

				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// first row
				KeyboardRow row = new KeyboardRow();
				row.add(BotLabels.LIST_ALL_ITEMS.getLabel());
				// row.add(BotLabels.ADD_NEW_ITEM.getLabel());
				// Add the first row to the keyboard
				keyboard.add(row);

				// second row
				row = new KeyboardRow();
				row.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				row.add(BotLabels.HIDE_MAIN_SCREEN.getLabel());
				keyboard.add(row);

				// Set the keyboard
				keyboardMarkup.setKeyboard(keyboard);

				// Add the keyboard markup
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.equals(BotCommands.START_COMMAND.getCommand())){
				userWelcomeState.put(chatId, false); // Reset the welcome state
				
			} else if (messageTextFromTelegram.indexOf(BotLabels.TO_DO.getLabel()) != -1) {

				String task = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(task);

				try {

					Task task1 = getTaskById(id).getBody();
					task1.setStatus("To Do");
					updateTask(task1, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
			} else if (messageTextFromTelegram.indexOf(BotLabels.IN_PROGRESS.getLabel()) != -1) {

				String task = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(task);

				try {

					Task task1 = getTaskById(id).getBody();
					task1.setStatus("In Progress");
					updateTask(task1, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
			} else if (messageTextFromTelegram.indexOf(BotLabels.COMPLETED.getLabel()) != -1) {

				String task = messageTextFromTelegram.substring(0,
						messageTextFromTelegram.indexOf(BotLabels.DASH.getLabel()));
				Integer id = Integer.valueOf(task);

				try {

					Task task1 = getTaskById(id).getBody();
					task1.setStatus("Completed");
					updateTask(task1, id);
					BotHelper.sendMessageToTelegram(chatId, BotMessages.ITEM_DONE.getMessage(), this);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			
			} else if (messageTextFromTelegram.equals(BotCommands.HIDE_COMMAND.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.HIDE_MAIN_SCREEN.getLabel())) {

				BotHelper.sendMessageToTelegram(chatId, BotMessages.BYE.getMessage(), this);

			} else if (messageTextFromTelegram.equals(BotCommands.TODO_LIST.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.LIST_ALL_ITEMS.getLabel())
					|| messageTextFromTelegram.equals(BotLabels.MY_TODO_LIST.getLabel())) {

				List<Task> allTasks = getAllTasks();
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// command back to main screen
				KeyboardRow mainScreenRowTop = new KeyboardRow();
				mainScreenRowTop.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainScreenRowTop);

				// KeyboardRow firstRow = new KeyboardRow();
				// firstRow.add(BotLabels.ADD_NEW_ITEM.getLabel());
				// keyboard.add(firstRow);

				// Nueva fila con el botón "Buscar tareas por usuario"
				KeyboardRow userTasksRow = new KeyboardRow();
				userTasksRow.add(BotLabels.SEARCH_TASKS_BY_USER.getLabel());
				keyboard.add(userTasksRow);

				// Nueva fila con el botón "Buscar tareas por prioridad"
				KeyboardRow priorityTasksRow = new KeyboardRow();
				priorityTasksRow.add(BotLabels.SEARCH_TASKS_BY_PRIORITY.getLabel());
				keyboard.add(priorityTasksRow);

				List<Task> activeTasks = allTasks.stream()
						.collect(Collectors.toList());

				for (Task task : activeTasks) {
					KeyboardRow currentRow = new KeyboardRow();
					currentRow.add(
						"🆔 " + task.getTaskId() + 
						" | 📄 " + task.getDescription() + 
						" | 📌 " + BotLabels.STATUS.getLabel() + task.getStatus()
					);
					keyboard.add(currentRow);
					//agregar botones para cambiar el estado de la tarea en la fila de abajo
					currentRow = new KeyboardRow();
					currentRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.TO_DO.getLabel());
					currentRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.IN_PROGRESS.getLabel());
					currentRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.COMPLETED.getLabel());
					keyboard.add(currentRow);
				}

				// Construir el mensaje de texto
				StringBuilder taskDetailsMessage = new StringBuilder();
				taskDetailsMessage.append("📋 *All tasks:*\n");

				// Formateador para la fecha
				DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

				// En tu loop para formatear las fechas:
				for (Task task : activeTasks) {
					String creationDateFormatted = task.getCreationDate().format(formatter);
					String realHoursFormatted = task.getRealHours() != null ? task.getRealHours().toString() : "Not Finished";
				
					taskDetailsMessage.append("🆔 " + task.getTaskId() + "\n" +
							"📄 " + task.getDescription() + "\n" +
							"📌 " + BotLabels.STATUS.getLabel() + task.getStatus() + "\n" +
							"🚀 Sprint: " + task.getSprint().getSprintName() + "\n" +
							"🕰️ Created: " + creationDateFormatted + "\n" +
							"⏳ Estimated Hours: " + task.getEstimatedHours() + "\n" +
							"🔑 Priority: " + task.getPriority() + "\n" +
							"👤 User: " + task.getUser().getName() + "\n" +
							"🏁 Real Hours: " + realHoursFormatted + "\n\n");
				}

				// command back to main screen
				KeyboardRow mainScreenRowBottom = new KeyboardRow();
				mainScreenRowBottom.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
				keyboard.add(mainScreenRowBottom);

				keyboardMarkup.setKeyboard(keyboard);

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText(taskDetailsMessage.toString());
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.equals(BotCommands.ADD_ITEM.getCommand())
					|| messageTextFromTelegram.equals(BotLabels.ADD_NEW_ITEM.getLabel())) {
				try {
					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(BotMessages.TYPE_NEW_TODO_ITEM.getMessage());
					// hide keyboard
					ReplyKeyboardRemove keyboardMarkup = new ReplyKeyboardRemove(true);
					messageToTelegram.setReplyMarkup(keyboardMarkup);

					// send message
					execute(messageToTelegram);

				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}

			} else if (messageTextFromTelegram.equals(BotLabels.SEARCH_TASKS_BY_USER.getLabel())) {

				List<User> allUsers = getAllUsers(); // Método para obtener usuarios
			
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();
			
				for (User user : allUsers) {
					KeyboardRow row = new KeyboardRow();
					row.add(user.getUserId() + BotLabels.DASH.getLabel() + user.getName());
					keyboard.add(row);
				}
			
				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText("Select a user:");
				keyboardMarkup.setKeyboard(keyboard);
				messageToTelegram.setReplyMarkup(keyboardMarkup);
			
				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			}   else if (messageTextFromTelegram.contains(BotLabels.DASH.getLabel())) {
				try {
					String[] parts = messageTextFromTelegram.split(BotLabels.DASH.getLabel());
					Integer userId = Integer.valueOf(parts[0]);
			
					List<Task> userTasks = getTasksByUserId(userId);
					ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
					List<KeyboardRow> keyboard = new ArrayList<>();
			
					// Botón para volver a la pantalla principal
					KeyboardRow mainScreenRowTop = new KeyboardRow();
					mainScreenRowTop.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					keyboard.add(mainScreenRowTop);
			
					if (userTasks.isEmpty()) {
						KeyboardRow noTasksRow = new KeyboardRow();
						noTasksRow.add("There are no tasks assigned to this user.");
						keyboard.add(noTasksRow);
					} else {
						for (Task task : userTasks) {
							// Fila con la tarea y su estado
							KeyboardRow taskRow = new KeyboardRow();
							taskRow.add(
							"🆔 " + task.getTaskId() + 
							" | 📄 " + task.getDescription() + 
							" | 📌 " + BotLabels.STATUS.getLabel() + task.getStatus()
							);
							keyboard.add(taskRow);
			
							// Fila con los botones para cambiar el estado
							KeyboardRow statusRow = new KeyboardRow();
							statusRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.TO_DO.getLabel());
							statusRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.IN_PROGRESS.getLabel());
							statusRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.COMPLETED.getLabel());
							keyboard.add(statusRow);
						}
					}

					// Construir el mensaje de texto
					StringBuilder taskDetailsMessage = new StringBuilder();
					taskDetailsMessage.append("📋 *Tasks assigned for this user:*\n");

					// Formateador para la fecha
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

					// En tu loop para formatear las fechas:
					for (Task task : userTasks) {
						String creationDateFormatted = task.getCreationDate().format(formatter);
						String realHoursFormatted = task.getRealHours() != null ? task.getRealHours().toString() : "Not Finished";
					
						taskDetailsMessage.append("🆔 " + task.getTaskId() + "\n" +
								"📄 " + task.getDescription() + "\n" +
								"📌 " + BotLabels.STATUS.getLabel() + task.getStatus() + "\n" +
								"🚀 Sprint: " + task.getSprint().getSprintName() + "\n" +
								"🕰️ Created: " + creationDateFormatted + "\n" +
								"⏳ Estimated Hours: " + task.getEstimatedHours() + "\n" +
								"🔑 Priority: " + task.getPriority() + "\n" +
								"👤 User: " + task.getUser().getName() + "\n" +
								"🏁 Real Hours: " + realHoursFormatted + "\n\n");
					}
			
					// Botón para volver a la pantalla principal al final
					KeyboardRow mainScreenRowBottom = new KeyboardRow();
					mainScreenRowBottom.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					keyboard.add(mainScreenRowBottom);
			
					keyboardMarkup.setKeyboard(keyboard);
			
					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(taskDetailsMessage.toString());
					messageToTelegram.setParseMode("Markdown");
					messageToTelegram.setReplyMarkup(keyboardMarkup);
			
					execute(messageToTelegram);
			
				} catch (Exception e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			}

			// Método para obtener tareas por prioridad y mostrar botones
			else if (messageTextFromTelegram.equals(BotLabels.SEARCH_TASKS_BY_PRIORITY.getLabel())) {
				// Mostrar opciones de prioridad
				ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
				List<KeyboardRow> keyboard = new ArrayList<>();

				// Fila con botones para elegir prioridad (Low, Mid, High)
				KeyboardRow row = new KeyboardRow();
				row.add(BotLabels.LOW.getLabel());    // Low priority
				row.add(BotLabels.MID.getLabel());    // Mid priority
				row.add(BotLabels.HIGH.getLabel());   // High priority
				keyboard.add(row);

				SendMessage messageToTelegram = new SendMessage();
				messageToTelegram.setChatId(chatId);
				messageToTelegram.setText("Select a priority:");
				keyboardMarkup.setKeyboard(keyboard);
				messageToTelegram.setReplyMarkup(keyboardMarkup);

				try {
					execute(messageToTelegram);
				} catch (TelegramApiException e) {
					logger.error(e.getLocalizedMessage(), e);
				}
			} 
			
			else if (messageTextFromTelegram.contains(BotLabels.LOW.getLabel()) ||
			messageTextFromTelegram.contains(BotLabels.MID.getLabel()) ||
			messageTextFromTelegram.contains(BotLabels.HIGH.getLabel())) {

				// Mapa para convertir las etiquetas de prioridad en enteros
				Map<String, Integer> priorityMap = new HashMap<>();
				priorityMap.put(BotLabels.LOW.getLabel(), 1);   // 1 -> Low
				priorityMap.put(BotLabels.MID.getLabel(), 2);   // 2 -> Mid
				priorityMap.put(BotLabels.HIGH.getLabel(), 3);  // 3 -> High

				// Extraer la prioridad seleccionada
				String selectedPriority = messageTextFromTelegram.contains(BotLabels.LOW.getLabel()) ? BotLabels.LOW.getLabel()
						: messageTextFromTelegram.contains(BotLabels.MID.getLabel()) ? BotLabels.MID.getLabel()
						: BotLabels.HIGH.getLabel();

				Integer priorityValue = priorityMap.get(selectedPriority);

				if (priorityValue != null) {
					// Obtener tareas por la prioridad seleccionada
					List<Task> tasksByPriority = getTasksByPriority(priorityValue);

					// Crear teclado con tareas filtradas por prioridad
					ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
					List<KeyboardRow> keyboard = new ArrayList<>();

					// Botón para volver a la pantalla principal
					KeyboardRow mainScreenRowTop = new KeyboardRow();
					mainScreenRowTop.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					keyboard.add(mainScreenRowTop);

					// Construir el mensaje de texto
					StringBuilder taskDetailsMessage = new StringBuilder();
					taskDetailsMessage.append("📋 *Tasks with Priority " + selectedPriority + ":*\n");

					// Formateador para la fecha
					DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

					// En tu loop para formatear las fechas:
					for (Task task : tasksByPriority) {
						String creationDateFormatted = task.getCreationDate().format(formatter);
						String realHoursFormatted = task.getRealHours() != null ? task.getRealHours().toString() : "Not Finished";
					
						taskDetailsMessage.append("🆔 " + task.getTaskId() + "\n" +
								"📄 " + task.getDescription() + "\n" +
								"📌 " + BotLabels.STATUS.getLabel() + task.getStatus() + "\n" +
								"🚀 Sprint: " + task.getSprint().getSprintName() + "\n" +
								"🕰️ Created: " + creationDateFormatted + "\n" +
								"⏳ Estimated Hours: " + task.getEstimatedHours() + "\n" +
								"🔑 Priority: " + task.getPriority() + "\n" +
								"👤 User: " + task.getUser().getName() + "\n" +
								"🏁 Real Hours: " + realHoursFormatted + "\n\n");
					}

					if (tasksByPriority.isEmpty()) {
						KeyboardRow noTasksRow = new KeyboardRow();
						noTasksRow.add("No tasks found with this priority.");
						keyboard.add(noTasksRow);
					} else {
						for (Task task : tasksByPriority) {
							// Fila con la tarea y su estado
							KeyboardRow taskRow = new KeyboardRow();
							taskRow.add(
								"🆔 " + task.getTaskId() +
								" | 📄 " + task.getDescription() +
								" | 📌 " + BotLabels.STATUS.getLabel() + task.getStatus()
							);
							keyboard.add(taskRow);

							// Fila con los botones para cambiar el estado
							KeyboardRow statusRow = new KeyboardRow();
							statusRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.TO_DO.getLabel());
							statusRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.IN_PROGRESS.getLabel());
							statusRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.COMPLETED.getLabel());
							keyboard.add(statusRow);
						}
					}

					// Botón para volver a la pantalla principal al final
					KeyboardRow mainScreenRowBottom = new KeyboardRow();
					mainScreenRowBottom.add(BotLabels.SHOW_MAIN_SCREEN.getLabel());
					keyboard.add(mainScreenRowBottom);

					keyboardMarkup.setKeyboard(keyboard);

					SendMessage messageToTelegram = new SendMessage();
					messageToTelegram.setChatId(chatId);
					messageToTelegram.setText(taskDetailsMessage.toString());
					messageToTelegram.setParseMode("Markdown");
					messageToTelegram.setReplyMarkup(keyboardMarkup);

					try {
						execute(messageToTelegram);
					} catch (TelegramApiException e) {
						logger.error(e.getLocalizedMessage(), e);
					}
				}
			}
		}
	}

	@Override
	public String getBotUsername() {		
		return botName;
	}

	// GET /tasks
	public List<Task> getAllTasks() {
		return taskService.findAll();
	}

	// Método para obtener todos los usuarios
	public List<User> getAllUsers() {
		return userService.findAll();
	}

	// Método para obtener las tareas de un usuario por ID
	public List<Task> getTasksByUserId(Integer userId) {
		Optional<User> user = userService.findById(userId);
		if (!user.isPresent()) {
			return new ArrayList<>();
		}
		return taskService.findByUserId(user.get());
	}

	//metodo para obtener las tareas por prioridad
	public List<Task> getTasksByPriority(Integer priority) {
		return taskService.findByPriority(priority);
	}

	// GET BY ID /tasks/{id}
	public ResponseEntity<Task> getTaskById(@PathVariable int id) {
		try {
			ResponseEntity<Task> responseEntity = taskService.getTaskById(id);
			return new ResponseEntity<Task>(responseEntity.getBody(), HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	// PUT /tasks
	public ResponseEntity addTask(@RequestBody Task task) throws Exception {
		Task td = taskService.addTask(task);
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("location", "" + td.getTaskId());
		responseHeaders.set("Access-Control-Expose-Headers", "location");
		// URI location = URI.create(""+td.getID())

		return ResponseEntity.ok().headers(responseHeaders).build();
	}

	// UPDATE /tasks/{id}
	public ResponseEntity updateTask(@RequestBody Task task, @PathVariable int id) {
		try {
			Task task1 = taskService.updateTask(id, task);
			System.out.println(task1.toString());
			return new ResponseEntity<>(task1, HttpStatus.OK);
		} catch (Exception e) {
			logger.error(e.getLocalizedMessage(), e);
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}
	// Method to validate chat ID and return user data if it matches
	public User validateChatIdAndGetUserData(long chatId) {
		try {
			// Find user by telegram_id
			Optional<User> user = userService.findByTelegramId(String.valueOf(chatId));
			if (user.isPresent()) {
				return user.get(); // Return user data if found
			} else {
				logger.info("No user found with telegram_id: " + chatId);
				return null; // Return null if no user matches
			}
		} catch (Exception e) {
			logger.error("Error validating chat ID: " + e.getLocalizedMessage(), e);
			return null; // Return null in case of an error
		}
	}


}