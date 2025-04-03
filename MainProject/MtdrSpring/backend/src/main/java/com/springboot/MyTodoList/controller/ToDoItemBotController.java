package com.springboot.MyTodoList.controller;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

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
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotHelper;
import com.springboot.MyTodoList.util.BotLabels;
import com.springboot.MyTodoList.util.BotMessages;

public class ToDoItemBotController extends TelegramLongPollingBot {

    private static final Logger logger = LoggerFactory.getLogger(ToDoItemBotController.class);
    private final TaskService taskService;
    private final UserService userService;
    private final SprintService sprintService;
    private final String botName;
    private final Map<Long, Boolean> userWelcomeState = new HashMap<>();
    private final Map<Long, Integer> userTaskCompletionState = new HashMap<>();
	private final Map<Long, Task> userTaskCreationState = new HashMap<>();
	private final Map<Long, String> userTaskCreationStep = new HashMap<>();

    public ToDoItemBotController(String botToken, String botName, TaskService taskService, UserService userService, SprintService sprintService) {
        super(botToken);
        this.taskService = taskService;
        this.userService = userService;
        this.sprintService = sprintService;
        this.botName = botName;
    }

    @Override
	public void onUpdateReceived(Update update) {
		if (update.hasCallbackQuery()) {
			String callbackData = update.getCallbackQuery().getData();
			long chatId = update.getCallbackQuery().getMessage().getChatId();

			if ("MAIN_MENU".equals(callbackData)) {
				showMainMenu(chatId); // Mostrar el menú principal
			}
		} else if (update.hasMessage() && update.getMessage().hasText()) {
			String messageText = update.getMessage().getText();
			long chatId = update.getMessage().getChatId();

			User user = validateChatIdAndGetUserData(chatId);
			if (user == null) {
				sendMessage(chatId, "User not found. Please register to use the bot.");
				return;
			}

			if (!userWelcomeState.getOrDefault(chatId, false)) {
				sendMessage(chatId, "Welcome, " + user.getName() + "! 👋");
				userWelcomeState.put(chatId, true);
			}

			// Manejar el flujo de creación de tareas si está activo
			if (userTaskCreationStep.containsKey(chatId)) {
				handleTaskCreationStep(chatId, messageText);
				return; // No continuar con handleCommand si ya se manejó aquí
			}

			handleCommand(chatId, messageText);
		}
	}

    private void handleCommand(long chatId, String messageText) {
		if (messageText.equals("Main Menu")) {
			showMainMenu(chatId); // Mostrar el menú principal
		} else if (messageText.equals(BotCommands.START_COMMAND.getCommand()) || messageText.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {
			showMainMenu(chatId);
		} else if (messageText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())) {
			showAllTasks(chatId);
		} else if (messageText.equals(BotLabels.ADD_NEW_ITEM.getLabel())) {
			startTaskCreation(chatId);
		} else if (messageText.equals(BotLabels.SEARCH_TASKS_BY_USER.getLabel())) {
			showUsers(chatId);
		} else if (messageText.equals(BotLabels.SEARCH_TASKS_BY_PRIORITY.getLabel())) {
			showPriorityOptions(chatId);
		} else if (messageText.equals(BotLabels.SEARCH_TASKS_BY_SPRINT.getLabel())) {
			showSprints(chatId);
		} else if (messageText.contains(BotLabels.UNDERSCORE.getLabel())) {
			showTasksBySprint(chatId, messageText);
		} else if (messageText.matches("\\d+" + BotLabels.DASH.getLabel() + ".*")) {
			// Dividir el mensaje en partes
			String[] parts = messageText.split(BotLabels.DASH.getLabel());
			if (parts.length == 2) {
				// Verificar si la segunda parte es un estado válido
				String possibleState = parts[1].trim();
				if (possibleState.equals(BotLabels.TO_DO.getLabel()) || 
					possibleState.equals(BotLabels.IN_PROGRESS.getLabel()) || 
					possibleState.equals(BotLabels.COMPLETED.getLabel())) {
					// Es un cambio de estado
					handleTaskStateChange(chatId, messageText);
				} else {
					// Es un usuario
					showTasksByUser(chatId, messageText);
				}
			} else {
				sendMessage(chatId, "Invalid input. Please try again.");
			}
		} else if (userTaskCompletionState.containsKey(chatId)) {
			handleTaskCompletion(chatId, messageText);
		} else {
			sendMessage(chatId, "Unknown command. Please try again.");
		}
	}

    private void showMainMenu(long chatId) {
		List<KeyboardRow> keyboard = new ArrayList<>();
		keyboard.add(createRow(BotLabels.LIST_ALL_ITEMS.getLabel(), BotLabels.ADD_NEW_ITEM.getLabel()));
		keyboard.add(createRow(BotLabels.SEARCH_TASKS_BY_USER.getLabel(), BotLabels.SEARCH_TASKS_BY_SPRINT.getLabel()));
		sendKeyboard(chatId, "Main Menu:", keyboard);
	}

	private void handleTaskCreationStep(long chatId, String messageText) {
		Task task = userTaskCreationState.get(chatId);
		String currentStep = userTaskCreationStep.get(chatId);
	
		switch (currentStep) {
			case "taskName":
				task.setTaskName(messageText);
				userTaskCreationStep.put(chatId, "description");
				sendMessage(chatId, "Please enter the task description:");
				break;
	
			case "description":
				task.setDescription(messageText);
				userTaskCreationStep.put(chatId, "priority");
				sendMessage(chatId, "Please enter the priority (1 = Low, 2 = Medium, 3 = High):");
				break;
	
			case "priority":
				try {
					int priority = Integer.parseInt(messageText.trim());
					if (priority < 1 || priority > 3) {
						sendMessage(chatId, "Invalid priority. Please enter a number (1 = Low, 2 = Medium, 3 = High):");
						return;
					}
					task.setPriority(priority);
					userTaskCreationStep.put(chatId, "userId");
	
					// Mostrar usuarios disponibles
					showUsers(chatId);
	
					sendMessage(chatId, "Please select a user:");
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Invalid priority. Please enter a number (1 = Low, 2 = Medium, 3 = High):");
				}
				break;
	
			case "userId":
				try {
					String[] parts = messageText.split(BotLabels.DASH.getLabel());
					int userId = Integer.parseInt(parts[0].trim());
	
					Optional<User> user = userService.findById(userId);
					if (user.isPresent()) {
						task.setUser(user.get());
						userTaskCreationStep.put(chatId, "sprintId");
	
						// Mostrar sprints disponibles
						showSprints(chatId);
	
						sendMessage(chatId, "Please select a sprint:");
					} else {
						sendMessage(chatId, "Invalid user ID. Please select a valid user:");
						showUsers(chatId);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Invalid input. Please enter a valid user ID:");
				} catch (Exception e) {
					logger.error("Error processing user ID: " + e.getMessage(), e);
					sendMessage(chatId, "An error occurred while processing the user. Please try again.");
				}
				break;
	
			case "sprintId":
				try {
					String[] parts = messageText.split(BotLabels.UNDERSCORE.getLabel());
					int sprintId = Integer.parseInt(parts[0].trim());
	
					Optional<Sprint> sprint = sprintService.findById(sprintId);
					if (sprint.isPresent()) {
						task.setSprint(sprint.get());
						userTaskCreationStep.put(chatId, "estimatedHours");
	
						sendMessage(chatId, "Please enter the estimated hours:");
					} else {
						sendMessage(chatId, "Invalid sprint ID. Please select a valid sprint:");
						showSprints(chatId);
					}
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Invalid input. Please enter a valid sprint ID:");
				} catch (Exception e) {
					logger.error("Error processing sprint ID: " + e.getMessage(), e);
					sendMessage(chatId, "An error occurred while processing the sprint. Please try again.");
				}
				break;
	
			case "estimatedHours":
				try {
					int estimatedHours = Integer.parseInt(messageText.trim());
					if (estimatedHours <= 0 || estimatedHours > 4) {
						sendMessage(chatId, "Invalid input. Please enter a number between 1 and 4:");
						return;
					}
					task.setEstimatedHours(estimatedHours);
	
					// Asignar un estado predeterminado
					task.setStatus("To Do");
	
					// Guardar la tarea en la base de datos
					taskService.addTask(task);
	
					// Limpiar el estado
					userTaskCreationState.remove(chatId);
					userTaskCreationStep.remove(chatId);
	
					sendMessage(chatId, "Task created successfully! 🎉");
					showMainMenu(chatId);
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Invalid input. Please enter a valid number for estimated hours:");
				} catch (Exception e) {
					logger.error("Error saving task: " + e.getMessage(), e);
					sendMessage(chatId, "An error occurred while saving the task. Please try again.");
				}
				break;
	
			default:
				sendMessage(chatId, "An error occurred. Please try again.");
				userTaskCreationState.remove(chatId);
				userTaskCreationStep.remove(chatId);
				showMainMenu(chatId);
				break;
		}
	}

	private void startTaskCreation(long chatId) {
		userTaskCreationState.put(chatId, new Task());
		userTaskCreationStep.put(chatId, "taskName");
	
		sendMessage(chatId, "Please enter the task name:");
	}

    private void showAllTasks(long chatId) {
		List<Task> tasks = getAllTasks();
		if (tasks.isEmpty()) {
			sendMessage(chatId, "No tasks found.");
			return;
		}
	
		// Construir el mensaje con los detalles de las tareas
		StringBuilder taskDetails = new StringBuilder("📋 *All Tasks:*\n\n");
		List<KeyboardRow> keyboard = new ArrayList<>();
	
		for (Task task : tasks) {
			// Agregar los detalles de la tarea al mensaje
			taskDetails.append(formatTaskDetails(task));
	
			// Crear un botón grande con la información básica de la tarea
			KeyboardRow taskInfoRow = new KeyboardRow();
			taskInfoRow.add("🆔 " + task.getTaskId() + 
							" | 📄 " + task.getDescription() + 
							" | 📌 " + task.getStatus());
			keyboard.add(taskInfoRow);
	
			// Crear una fila de botones para cambiar el estado
			KeyboardRow stateButtonsRow = new KeyboardRow();
			stateButtonsRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.TO_DO.getLabel());
			stateButtonsRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.IN_PROGRESS.getLabel());
			stateButtonsRow.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.COMPLETED.getLabel());
			keyboard.add(stateButtonsRow);
	
			// Agregar un espacio entre tareas para claridad
			taskDetails.append("\n");
		}
	
		// Enviar el mensaje con los detalles y los botones
		sendKeyboard(chatId, taskDetails.toString(), keyboard);
	}

    private void showUsers(long chatId) {
        List<User> users = getAllUsers();
        if (users.isEmpty()) {
            sendMessage(chatId, "No users found.");
            return;
        }

        List<KeyboardRow> keyboard = new ArrayList<>();
        for (User user : users) {
            keyboard.add(createRow(user.getUserId() + BotLabels.DASH.getLabel() + user.getName()));
        }

        sendKeyboard(chatId, "Select a user:", keyboard);
    }

	private void showTasksByUser(long chatId, String messageText) {
		try {
			// Dividir el mensaje para extraer el ID del usuario
			String[] parts = messageText.split(BotLabels.DASH.getLabel());
			Integer userId = Integer.valueOf(parts[0]); // Extraer solo el ID numérico
	
			// Obtener las tareas asociadas al usuario
			List<Task> tasks = getTasksByUserId(userId);
			if (tasks.isEmpty()) {
				sendMessage(chatId, "No tasks found for this user.");
				return;
			}
	
			// Construir el mensaje con los detalles de las tareas
			StringBuilder taskDetails = new StringBuilder("📋 *Tasks for User:*\n");
			for (Task task : tasks) {
				taskDetails.append(formatTaskDetails(task));
			}
	
			// Enviar las tareas al usuario
			sendMessage(chatId, taskDetails.toString());
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please select a valid user ID.");
		} catch (Exception e) {
			logger.error("Error fetching tasks by user: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while fetching tasks. Please try again.");
		}
	}

    private void showPriorityOptions(long chatId) {
        List<KeyboardRow> keyboard = new ArrayList<>();
        keyboard.add(createRow(BotLabels.LOW.getLabel(), BotLabels.MID.getLabel(), BotLabels.HIGH.getLabel()));
        sendKeyboard(chatId, "Select a priority:", keyboard);
    }

    private void showSprints(long chatId) {
        List<Sprint> sprints = getAllSprints();
        if (sprints.isEmpty()) {
            sendMessage(chatId, "No sprints found.");
            return;
        }

        List<KeyboardRow> keyboard = new ArrayList<>();
        for (Sprint sprint : sprints) {
            keyboard.add(createRow(sprint.getSprintId() + BotLabels.UNDERSCORE.getLabel() + sprint.getSprintName()));
        }

        sendKeyboard(chatId, "Select a sprint:", keyboard);
    }

	private void showTasksBySprint(long chatId, String messageText) {
		try {
			String[] parts = messageText.split(BotLabels.UNDERSCORE.getLabel());
			Integer sprintId = Integer.valueOf(parts[0]);
			List<Task> tasks = getTasksBySprintId(sprintId);
			if (tasks.isEmpty()) {
				sendMessage(chatId, "No tasks found for this sprint.");
				return;
			}
			StringBuilder taskDetails = new StringBuilder("📋 *Tasks for Sprint:*\n")
					.append(tasks.stream()
							.map(task -> formatTaskDetails(task))
							.collect(Collectors.joining("\n")));
			sendMessage(chatId, taskDetails.toString());
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please enter a valid sprint ID:");
		} catch (Exception e) {
			logger.error("Error fetching tasks by sprint: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while fetching tasks. Please try again.");
		}
	}

	private void showTasksByPriority(long chatId, String messageText) {
		try {
			Integer priority = Integer.valueOf(messageText); // Convertir el mensaje a un número
	
			List<Task> tasks = getTasksByPriority(priority);
			if (tasks.isEmpty()) {
				sendMessage(chatId, "No tasks found for this priority.");
				return;
			}
	
			// Construir el mensaje con los detalles de las tareas
			StringBuilder taskDetails = new StringBuilder("📋 *Tasks with Priority " + priority + ":*\n");
			for (Task task : tasks) {
				taskDetails.append(formatTaskDetails(task));
			}
	
			// Enviar las tareas al usuario
			sendMessage(chatId, taskDetails.toString());
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please enter a valid priority (1 = Low, 2 = Medium, 3 = High).");
		} catch (Exception e) {
			logger.error("Error fetching tasks by priority: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while fetching tasks. Please try again.");
		}
	}

    private void handleTaskStateChange(long chatId, String messageText) {
		try {
			// Dividir el mensaje para extraer el ID de la tarea y el nuevo estado
			String[] parts = messageText.split(BotLabels.DASH.getLabel());
			Integer taskId = Integer.valueOf(parts[0]); // Extraer el ID de la tarea
			String newState = parts[1].trim(); // Extraer el nuevo estado
	
			Task task = getTaskById(taskId).getBody();
			if (task == null) {
				sendMessage(chatId, "Task not found.");
				return;
			}
	
			// Verificar el nuevo estado y actualizar la tarea
			if (newState.equals(BotLabels.COMPLETED.getLabel())) {
				userTaskCompletionState.put(chatId, taskId);
				sendMessage(chatId, "Please enter the real hours it took to complete the task:");
			} else if (newState.equals(BotLabels.IN_PROGRESS.getLabel())) {
				task.setStatus("In Progress");
				updateTask(task, taskId);
				sendMessage(chatId, "Task marked as in progress. 🔄");
			} else if (newState.equals(BotLabels.TO_DO.getLabel())) {
				task.setStatus("To Do");
				updateTask(task, taskId);
				sendMessage(chatId, "Task marked as to do. 📋");
			} else {
				sendMessage(chatId, "Invalid state. Please use a valid option.");
			}
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please enter a valid task ID.");
		} catch (Exception e) {
			logger.error("Error updating task state: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while updating the task. Please try again.");
		}
	}

    private void handleTaskCompletion(long chatId, String messageText) {
		try {
			// Obtener el ID de la tarea desde el estado del usuario
			Integer taskId = userTaskCompletionState.get(chatId);
			if (taskId == null) {
				sendMessage(chatId, "No task selected for completion.");
				return;
			}
	
			// Validar que el mensaje sea un número válido
			Integer realHours = Integer.valueOf(messageText);
	
			Task task = getTaskById(taskId).getBody();
			if (task == null) {
				sendMessage(chatId, "Task not found.");
				return;
			}
	
			// Actualizar el estado y las horas reales de la tarea
			task.setStatus("Completed");
			task.setRealHours(realHours);
			updateTask(task, taskId);
	
			sendMessage(chatId, "Task marked as completed with " + realHours + " real hours. ✅");
	
			// Limpiar el estado del usuario
			userTaskCompletionState.remove(chatId);
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please enter a valid number for real hours:");
		} catch (Exception e) {
			logger.error("Error completing task: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while completing the task. Please try again.");
		}
	}

    private String formatTaskDetails(Task task) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String creationDate = task.getCreationDate().format(formatter);
        String realHours = task.getRealHours() != null ? task.getRealHours().toString() : "Not Finished";

        return String.format(
            "🆔 %d\n📄 %s\n📌 %s\n🚀 Sprint: %s\n🕰️ Created: %s\n⏳ Estimated Hours: %d\n🔑 Priority: %d\n👤 User: %s\n🏁 Real Hours: %s\n\n",
            task.getTaskId(), task.getDescription(), task.getStatus(), task.getSprint().getSprintName(),
            creationDate, task.getEstimatedHours(), task.getPriority(), task.getUser().getName(), realHours
        );
    }

    private void sendMessage(long chatId, String text) {
        try {
            execute(new SendMessage(String.valueOf(chatId), text));
        } catch (TelegramApiException e) {
            logger.error("Error sending message: " + e.getMessage(), e);
        }
    }

    private void sendKeyboard(long chatId, String text, List<KeyboardRow> keyboard) {
		try {
			// Agregar el botón "Main Menu" al teclado
			KeyboardRow mainMenuRow = new KeyboardRow();
			mainMenuRow.add("Main Menu");
			keyboard.add(mainMenuRow);
	
			// Configurar el teclado
			ReplyKeyboardMarkup keyboardMarkup = new ReplyKeyboardMarkup();
			keyboardMarkup.setKeyboard(keyboard);
			keyboardMarkup.setResizeKeyboard(true); // Ajustar el tamaño del teclado
			keyboardMarkup.setOneTimeKeyboard(false); // Hacer el teclado persistente
	
			// Enviar el mensaje con el teclado
			SendMessage message = new SendMessage(String.valueOf(chatId), text);
			message.setReplyMarkup(keyboardMarkup);
			execute(message);
		} catch (TelegramApiException e) {
			logger.error("Error sending keyboard: " + e.getMessage(), e);
		}
	}

    private KeyboardRow createRow(String... buttons) {
        KeyboardRow row = new KeyboardRow();
        row.addAll(Arrays.asList(buttons));
        return row;
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

	// metodo para obtener todos los sprints
	public List<Sprint> getAllSprints() {
		return sprintService.findAll();
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

	// Metodo para obtener las tareas por sprint
	public List<Task> getTasksBySprintId(Integer sprintId) {
		Optional<Sprint> sprint = sprintService.findById(sprintId);
		if (!sprint.isPresent()) {
			return new ArrayList<>();
		}
		return taskService.findBySprintId(sprint.get());
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