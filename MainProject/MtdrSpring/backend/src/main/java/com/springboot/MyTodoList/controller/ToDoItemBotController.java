package com.springboot.MyTodoList.controller;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.time.format.DateTimeParseException;
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
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import com.springboot.MyTodoList.dto.KpiResponse;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Task;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.model.Sprint;
import com.springboot.MyTodoList.model.Action;
import com.springboot.MyTodoList.service.TaskService;
import com.springboot.MyTodoList.service.UserService;
import com.springboot.MyTodoList.service.SprintService;
import com.springboot.MyTodoList.service.AIService;
import com.springboot.MyTodoList.service.ValidatorService;
import com.springboot.MyTodoList.validation.MissingParamResolver;
import com.springboot.MyTodoList.util.BotCommands;
import com.springboot.MyTodoList.util.BotLabels;

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
  private final Map<Long, String> userTaskCompletionStep = new HashMap<>();
  private AIService aiService = new AIService("https://api.openai.com/v1/chat/completions", "apikey");

	// Map to store AI corrections waiting for user input (keyed by chat id)
	private Map<Long, AiActionCorrection> aiCorrectionMap = new HashMap<>();

	private static class AiActionCorrection {
        Action action;
        List<String> errors;
        public AiActionCorrection(Action action, List<String> errors) {
            this.action = action;
            this.errors = errors;
        }
    }

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
				clearUserCreationState(chatId);
				showMainMenu(chatId);
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

			// Permitir cancelar la creación de tareas
			if (messageText.equals("❌ Cancel Task Creation")) {
				clearUserCreationState(chatId);
				sendMessage(chatId, "Task creation cancelled.");
				showMainMenu(chatId);
				return;
			}

			// Permitir salir con Main Menu
			if (userTaskCreationStep.containsKey(chatId)) {
				if (messageText.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel()) || messageText.equals("Main Menu")) {
					clearUserCreationState(chatId);
					showMainMenu(chatId);
					return;
				}

				handleTaskCreationStep(chatId, messageText);
				return;
			}

			handleCommand(chatId, messageText);
		}
	}

    private void handleCommand(long chatId, String messageText) {
		// Verificar si el usuario está en el flujo de creación de tareas
		if (userTaskCreationStep.containsKey(chatId)) {
			handleTaskCreationStep(chatId, messageText);
			return; // Salir para evitar procesar comandos generales
		}
	
    // if message starts with "/ai"
    if (messageText.toLowerCase().startsWith("/ai")) {
        String aiInstruction = messageText.replaceFirst("(?i)/ai", "").trim();
        
        // date/time for ai context
        OffsetDateTime now = OffsetDateTime.now();
        String currentDateTime = now.toString();
        
        // AI prompt, -> extracts Action from AI service
        String fullPrompt = buildAiPrompt(aiInstruction, currentDateTime);
        Action aiAction = aiService.obtainAiAction(fullPrompt);
        if (aiAction == null) {
            sendMessage(chatId, "⚠️ There was an error processing your AI command. Please try again.");
            return;
        }

		if (messageText.equals("❌ Cancel Task Creation")) {
			clearUserCreationState(chatId);
			sendMessage(chatId, "Task creation cancelled.");
			showMainMenu(chatId);
			return;
		}
        
        // validate action
        List<String> validationErrors = ValidatorService.validateAction(aiAction);
        if (!validationErrors.isEmpty()) {
            // get which fields are missing/invalid 
            List<MissingParamResolver.MissingFieldInfo> issues = MissingParamResolver.getMissingOrInvalidFields(aiAction);
            // Convert AI action values into a Task using the existing manual creation state
            Task task = new Task();
            // Pre-fill fields that exist in the AI output
            if (aiAction.getParams().get("task_name") != null) {
                task.setTaskName(aiAction.getParams().get("task_name").toString());
            }
            if (aiAction.getParams().get("description") != null) {
                task.setDescription(aiAction.getParams().get("description").toString());
            }
            if (aiAction.getParams().get("priority") != null) {
                try {
                    task.setPriority(Integer.parseInt(aiAction.getParams().get("priority").toString()));
                } catch (NumberFormatException e) {
                    // leave empty for manual input
                }
            }
			if (aiAction.getParams().get("estimated_finish_date") != null) {
				try {
					String dateString = aiAction.getParams().get("estimated_finish_date").toString();
					OffsetDateTime finishDate = OffsetDateTime.parse(dateString);
					task.setEstimatedFinishDate(finishDate);
				} catch (DateTimeParseException e) {
					logger.warn("Could not parse estimated finish date: " + aiAction.getParams().get("estimated_finish_date"));
					// leave empty for manual input
				}
			}
			if (aiAction.getParams().get("sprint_id") != null) {
				try {
					int sprintIdValue = Integer.parseInt(aiAction.getParams().get("sprint_id").toString());
					Optional<Sprint> sprintOptional = sprintService.findById(sprintIdValue);
					if (sprintOptional.isPresent()) {
						task.setSprint(sprintOptional.get());
					} else {
						logger.warn("Sprint not found for id: " + sprintIdValue);
					}
				} catch (NumberFormatException e) {
					logger.warn("Could not parse sprint id: " + aiAction.getParams().get("sprint_id"));
				}
			}
			
			if (aiAction.getParams().get("user_id") != null) {
				try {
					int userIdValue = Integer.parseInt(aiAction.getParams().get("user_id").toString());
					Optional<User> userOptional = userService.findById(userIdValue);
					if (userOptional.isPresent()) {
						task.setUser(userOptional.get());
					} else {
						logger.warn("User not found for id: " + userIdValue);
					}
				} catch (NumberFormatException e) {
					logger.warn("Could not parse user id: " + aiAction.getParams().get("user_id"));
				}
			}
            // Cache task for AI-based creation:
            userTaskCreationState.put(chatId, task);
            // determine which missing field to ask for:
            MissingParamResolver.MissingFieldInfo nextIssue = issues.get(0); // take first missing field
            userTaskCreationStep.put(chatId, nextIssue.getFieldName());
            
            // back to same manual flow for prompting:
            if ("user_id".equalsIgnoreCase(nextIssue.getFieldName())) {
                showUsers(chatId);  // This will present inline keyboard options
            } else if ("sprint_id".equalsIgnoreCase(nextIssue.getFieldName())) {
                showSprints(chatId); // Inline keyboard for sprint selection
            } else {
                // For other fields, send a plain text prompt using your existing method
                sendKeyboard(chatId, "Please provide a value for " + nextIssue.getFieldName() + ":", cancelKeyboard());
            }
            // At this point the creation flow continues in handleTaskCreationStep as the user supplies the missing values.
        } else {
            // If no fields are missing/invalid, continue with execution
            processValidAction(aiAction, chatId);
        }
        return; // End /ai command processing.

		// Procesar comandos generales
		} else if (messageText.equals("Main Menu")) {
			showMainMenu(chatId); // Mostrar el menú principal
		} else if (messageText.equals("📊 Show Project KPIs")) {
			showKpis(chatId);
		} else if (messageText.equals("👤 KPIs by User")) { // Nuevo comando para KPIs por usuario
			showUsersForKpis(chatId);
		} else if (messageText.equals("🚀 KPIs by Sprint")) { // Nuevo comando para KPIs por sprint
			showSprintsForKpis(chatId);
		} else if (messageText.startsWith("User KPIs:")) { // Manejar selección de usuario para KPIs
			showKpisByUser(chatId, messageText);
		} else if (messageText.startsWith("Sprint KPIs:")) { // Manejar selección de sprint para KPIs
			showKpisBySprint(chatId, messageText);
		} else if (messageText.equals(BotCommands.START_COMMAND.getCommand()) || messageText.equals(BotLabels.SHOW_MAIN_SCREEN.getLabel())) {
			showMainMenu(chatId);
		} else if (messageText.equals(BotLabels.LIST_ALL_ITEMS.getLabel())) {
			showTaskNames(chatId, getAllTasks());
		} else if (messageText.equals("🟢 Add New Task")) {
			startTaskCreation(chatId);
		} else if (messageText.equals("🔍👤 Tasks by User")) {
			showUsers(chatId);
		} else if (messageText.equals("🔍🚀 Tasks by Sprint")) {
			showSprints(chatId);
		} else if (messageText.equals("📋 My Tasks")) { // Manejar el botón "📋 My Tasks"
			showMyTasks(chatId);
		} else if (messageText.contains(BotLabels.UNDERSCORE.getLabel())) {
			showTasksBySprint(chatId, messageText);
		} else if (messageText.matches("\\d+" + BotLabels.DASH.getLabel() + ".*")) {
			// Dividir el mensaje en partes
			String[] parts = messageText.split(BotLabels.DASH.getLabel());
			if (parts.length == 2) {
				// Verificar si la segunda parte es un estado válido
				String possibleState = parts[1].trim();
				if (possibleState.equals(BotLabels.BLOCKED.getLabel()) ||
					possibleState.equals(BotLabels.TO_DO.getLabel()) || 
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
		} else if (messageText.startsWith("🆔")) {
			// Manejar la selección de una tarea
			handleTaskSelection(chatId, messageText);
		} else if (userTaskCompletionState.containsKey(chatId)) {
			handleTaskCompletion(chatId, messageText);
		} else {
			sendMessage(chatId, "Unknown command. Please try again.");
		}
	}

	private void showMainMenu(long chatId) {
		List<KeyboardRow> keyboard = new ArrayList<>();
		keyboard.add(createRow("🟢 Add New Task")); // Agregar emoji al botón
		keyboard.add(createRow("🔍👤 Tasks by User", "🔍🚀 Tasks by Sprint"));
		keyboard.add(createRow("📊 Show Project KPIs", "👤 KPIs by User", "🚀 KPIs by Sprint"));
		keyboard.add(createRow("📋 My Tasks")); // Agregar el botón "📋 My Tasks"
		sendKeyboard(chatId, "Main Menu:", keyboard);
	}

	private void handleTaskCreationStep(long chatId, String messageText) {
		if (messageText.equals("❌ Cancel Task Creation")) {
			clearUserCreationState(chatId);
			sendMessage(chatId, "Task creation cancelled.");
			showMainMenu(chatId);
			return;
		}
	
		Task task = userTaskCreationState.get(chatId);
		String currentStep = userTaskCreationStep.get(chatId);
	
		switch (currentStep) {
			case "taskName":
				task.setTaskName(messageText);
				userTaskCreationStep.put(chatId, "description");
				sendKeyboard(chatId, "📄 Please enter the task description:", cancelKeyboard());
				break;
	
			case "description":
				task.setDescription(messageText);
				userTaskCreationStep.put(chatId, "priority");
				sendKeyboard(chatId, "🔑 Please enter the priority (1 = Low, 2 = Medium, 3 = High):", cancelKeyboard());
				break;
	
			case "priority":
				try {
					int priority = Integer.parseInt(messageText.trim());
					if (priority < 1 || priority > 3) {
						sendKeyboard(chatId, "⚠️ Invalid priority. Please enter a number (1 = Low, 2 = Medium, 3 = High):", cancelKeyboard());
						return;
					}
					task.setPriority(priority);
					userTaskCreationStep.put(chatId, "userId");
	
					showUsers(chatId);
				} catch (NumberFormatException e) {
					sendKeyboard(chatId, "⚠️ Invalid priority. Please enter a number (1 = Low, 2 = Medium, 3 = High):", cancelKeyboard());
				}
				break;
	
			case "userId":
				if (!messageText.matches("\\d+" + BotLabels.DASH.getLabel() + ".*")) {
					sendMessage(chatId, "⚠️ Invalid input. Please select a user from the menu:");
					showUsers(chatId); // Volver a mostrar la lista de usuarios
					return;
				}
	
				try {
					String[] parts = messageText.split(BotLabels.DASH.getLabel());
					int userId = Integer.parseInt(parts[0].trim());
	
					Optional<User> user = userService.findById(userId);
					if (user.isPresent()) {
						task.setUser(user.get());
						userTaskCreationStep.put(chatId, "sprintId");
	
						showSprints(chatId);
					} else {
						sendKeyboard(chatId, "⚠️ Invalid user ID. Please select a valid user:", cancelKeyboard());
						showUsers(chatId); // Volver a mostrar la lista de usuarios
					}
				} catch (Exception e) {
					logger.error("Error processing user ID: " + e.getMessage(), e);
					sendKeyboard(chatId, "⚠️ An error occurred while processing the user. Please try again:", cancelKeyboard());
					showUsers(chatId); // Volver a mostrar la lista de usuarios
				}
				break;
	
			case "sprintId":
				if (!messageText.matches("\\d+" + BotLabels.UNDERSCORE.getLabel() + ".*")) {
					sendMessage(chatId, "⚠️ Invalid input. Please select a sprint from the menu:");
					showSprints(chatId); // Volver a mostrar la lista de sprints
					return;
				}
	
				try {
					String[] parts = messageText.split(BotLabels.UNDERSCORE.getLabel());
					int sprintId = Integer.parseInt(parts[0].trim());
	
					Optional<Sprint> sprint = sprintService.findById(sprintId);
					if (sprint.isPresent()) {
						task.setSprint(sprint.get());
						userTaskCreationStep.put(chatId, "estimatedHours");
	
						sendKeyboard(chatId, "⏳ Please enter the estimated hours (1-4):", cancelKeyboard());
					} else {
						sendKeyboard(chatId, "⚠️ Invalid sprint ID. Please select a valid sprint:", cancelKeyboard());
						showSprints(chatId); // Volver a mostrar la lista de sprints
					}
				} catch (Exception e) {
					logger.error("Error processing sprint ID: " + e.getMessage(), e);
					sendKeyboard(chatId, "⚠️ An error occurred while processing the sprint. Please try again:", cancelKeyboard());
					showSprints(chatId); // Volver a mostrar la lista de sprints
				}
				break;
	
			case "estimatedHours":
				try {
					int estimatedHours = Integer.parseInt(messageText.trim());
					if (estimatedHours <= 0 || estimatedHours > 4) {
						sendKeyboard(chatId, "⚠️ Invalid input. Please enter a number between 1 and 4:", cancelKeyboard());
						return;
					}
					task.setEstimatedHours(estimatedHours);
					userTaskCreationStep.put(chatId, "estimatedFinishDate");
	
					sendKeyboard(chatId, "📅 Please enter the estimated finish date and time in the format `YYYY/MM/DD HH:mm`:", cancelKeyboard());
				} catch (Exception e) {
					logger.error("Error processing estimated hours: " + e.getMessage(), e);
					sendKeyboard(chatId, "⚠️ An error occurred. Please try again:", cancelKeyboard());
				}
				break;
	
			case "estimatedFinishDate":
				try {
					OffsetDateTime estimatedFinishDate = parseDateTimeInput(messageText);
					task.setEstimatedFinishDate(estimatedFinishDate);
	
					task.setStatus("To Do");
					taskService.addTask(task);
	
					clearUserCreationState(chatId);
					sendMessage(chatId, "✅ Task created successfully! 🎉");
					sendMessage(chatId, formatTaskDetails(task));
					showMainMenu(chatId);
				} catch (Exception e) {
					logger.error("Error processing estimated finish date: " + e.getMessage(), e);
					sendKeyboard(chatId, "⚠️ Invalid date and time format. Please use `YYYY/MM/DD HH:mm`:", cancelKeyboard());
				}
				break;
	
			default:
				clearUserCreationState(chatId);
				sendMessage(chatId, "⚠️ An error occurred. Please try again.");
				showMainMenu(chatId);
				break;
		}
	}
		

	private void startTaskCreation(long chatId) {
		userTaskCreationState.put(chatId, new Task());
		userTaskCreationStep.put(chatId, "taskName");
	
		sendKeyboard(chatId, "📝 Please enter the task name:", cancelKeyboard());
	}	

	private ReplyKeyboardMarkup cancelKeyboard() {
		KeyboardRow row = new KeyboardRow();
		row.add("❌ Cancel Task Creation");
	
		List<KeyboardRow> keyboard = new ArrayList<>();
		keyboard.add(row);
	
		ReplyKeyboardMarkup markup = new ReplyKeyboardMarkup();
		markup.setKeyboard(keyboard);
		markup.setResizeKeyboard(true);
		markup.setOneTimeKeyboard(false);
		return markup;
	}
	
	private void sendKeyboard(long chatId, String text, ReplyKeyboardMarkup keyboard) {
		SendMessage message = new SendMessage();
		message.setChatId(String.valueOf(chatId));
		message.setText(text);
		message.setReplyMarkup(keyboard);
	
		try {
			execute(message);
		} catch (TelegramApiException e) {
			logger.error("Error sending keyboard: " + e.getMessage(), e);
		}
	}	

	private void clearUserCreationState(long chatId) {
		userTaskCreationState.remove(chatId);
		userTaskCreationStep.remove(chatId);
	}

	private void showTaskNames(long chatId, List<Task> tasks) {
		if (tasks.isEmpty()) {
			sendMessage(chatId, "No tasks found.");
			return;
		}
	
		// Ordenar las tareas por estado: Blocked, To Do, In Progress, Completed
		tasks.sort((task1, task2) -> {
			List<String> order = Arrays.asList("Blocked", "To Do", "In Progress", "Completed");
			return Integer.compare(order.indexOf(task1.getStatus()), order.indexOf(task2.getStatus()));
		});
	
		// Construir el mensaje con los nombres de las tareas
		StringBuilder taskNames = new StringBuilder("📋 *Task Names (Ordered by Status):*\n\n");
		List<KeyboardRow> keyboard = new ArrayList<>();
	
		for (Task task : tasks) {
			taskNames.append("ID: ").append(task.getTaskId())
					 .append(" 📄 ").append(task.getTaskName())
					 .append("\n")
					 .append(" 📌 ").append(task.getStatus())
					 .append("\n\n");
	
			// Crear un botón principal para cada tarea
			KeyboardRow taskInfoRow = new KeyboardRow();
			taskInfoRow.add("🆔 " + task.getTaskId() + 
							" | 📄 " + task.getTaskName() + 
							" | 📌 " + task.getStatus());
			keyboard.add(taskInfoRow);
		}
	
		// Enviar el mensaje con los nombres de las tareas
		sendMessage(chatId, taskNames.toString());
	
		// Agregar un mensaje adicional
		sendMessage(chatId, "Select a task to view more details or change its status.");
	
		// Enviar el teclado con los botones principales
		sendKeyboard(chatId, "Tasks Menu:", keyboard);
	}
	
	private void showTaskDetails(long chatId, Task task) {
		// Construir el mensaje con los detalles de la tarea
		String taskDetails = formatTaskDetails(task);
	
		// Crear el teclado con los botones de cambio de estado
		List<KeyboardRow> keyboard = new ArrayList<>();
		KeyboardRow row1 = new KeyboardRow();
		row1.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.BLOCKED.getLabel());
		row1.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.TO_DO.getLabel());
		keyboard.add(row1);
	
		KeyboardRow row2 = new KeyboardRow();
		row2.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.IN_PROGRESS.getLabel());
		row2.add(task.getTaskId() + BotLabels.DASH.getLabel() + BotLabels.COMPLETED.getLabel());
		keyboard.add(row2);
	
		// Enviar el mensaje con los detalles de la tarea
		sendMessage(chatId, taskDetails);
	
		// Enviar el teclado con los botones de cambio de estado
		sendKeyboard(chatId, "Change Task Status:", keyboard);
	}
	
	private void handleTaskSelection(long chatId, String messageText) {
		try {
			// Extraer el ID de la tarea del mensaje
			String[] parts = messageText.split("\\|");
			int taskId = Integer.parseInt(parts[0].replace("🆔", "").trim());
	
			// Obtener la tarea por ID
			Task task = getTaskById(taskId).getBody();
			if (task == null) {
				sendMessage(chatId, "Task not found.");
				return;
			}
	
			// Mostrar los detalles de la tarea
			showTaskDetails(chatId, task);
		} catch (Exception e) {
			logger.error("Error handling task selection: " + e.getMessage(), e);
			sendMessage(chatId, "Invalid task selection. Please try again.");
		}
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

	private void showMyTasks(long chatId) {
		try {
			// Validar el usuario actual
			User user = validateChatIdAndGetUserData(chatId);
			if (user == null) {
				sendMessage(chatId, "User not found. Please register to use the bot.");
				return;
			}
	
			// Obtener las tareas del usuario actual
			List<Task> tasks = getTasksByUserId(user.getUserId());
			if (tasks.isEmpty()) {
				sendMessage(chatId, "You have no tasks assigned.");
				return;
			}
	
			// Reutilizar el método showTaskNames para mostrar las tareas
			showTaskNames(chatId, tasks);
		} catch (Exception e) {
			logger.error("Error fetching tasks for user: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while fetching your tasks. Please try again.");
		}
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
	
			// Reutilizar el método showTaskNames para mostrar los nombres de las tareas
			showTaskNames(chatId, tasks);
	
		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please select a valid user ID.");
		} catch (Exception e) {
			logger.error("Error fetching tasks by user: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while fetching tasks. Please try again.");
		}
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
			// Dividir el mensaje para extraer el ID del sprint
			String[] parts = messageText.split(BotLabels.UNDERSCORE.getLabel());
			Integer sprintId = Integer.valueOf(parts[0]);
	
			// Obtener las tareas asociadas al sprint
			List<Task> tasks = getTasksBySprintId(sprintId);
			if (tasks.isEmpty()) {
				sendMessage(chatId, "No tasks found for this sprint.");
				return;
			}
	
			// Reutilizar el método showTaskNames para mostrar los nombres de las tareas
			showTaskNames(chatId, tasks);

		} catch (NumberFormatException e) {
			sendMessage(chatId, "Invalid input. Please enter a valid sprint ID:");
		} catch (Exception e) {
			logger.error("Error fetching tasks by sprint: " + e.getMessage(), e);
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
				showTaskDetails(chatId, task);
			} else if (newState.equals(BotLabels.TO_DO.getLabel())) {
				task.setStatus("To Do");
				updateTask(task, taskId);
				sendMessage(chatId, "Task marked as to do. 📋");
				showTaskDetails(chatId, task);
			} else if (newState.equals(BotLabels.BLOCKED.getLabel())) {
				task.setStatus("Blocked");
				updateTask(task, taskId);
				sendMessage(chatId, "Task marked as blocked. 🚫");
				showTaskDetails(chatId, task);
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
	
			Task task = getTaskById(taskId).getBody();
			if (task == null) {
				sendMessage(chatId, "Task not found.");
				return;
			}
	
			// Verificar el paso actual del flujo
			String currentStep = userTaskCompletionStep.getOrDefault(chatId, "realHours");
	
			if ("realHours".equals(currentStep)) {
				// Primera etapa: ingresar las horas reales
				try {
					Integer realHours = Integer.valueOf(messageText);
					task.setRealHours(realHours);
	
					// Actualizar la tarea en la base de datos
					updateTask(task, taskId);
	
					// Solicitar la fecha y hora real de finalización
					sendMessage(chatId, "📅 Please enter the real finish date and time in the format `YYYY/MM/DD HH:mm`:");
					userTaskCompletionStep.put(chatId, "realFinishDate"); // Cambiar al siguiente paso
					return;
				} catch (NumberFormatException e) {
					sendMessage(chatId, "Invalid input. Please enter a valid number for real hours:");
					return;
				}
			}
	
			if ("realFinishDate".equals(currentStep)) {
				// Segunda etapa: ingresar la fecha y hora real de finalización
				try {
					OffsetDateTime realFinishDate = parseDateTimeInput(messageText);
					task.setRealFinishDate(realFinishDate);
	
					// Actualizar el estado de la tarea a completada
					task.setStatus("Completed");
					updateTask(task, taskId);
	
					sendMessage(chatId, "✅ Task marked as completed with real finish date: " + realFinishDate.toString());
					userTaskCompletionState.remove(chatId); // Limpiar el estado del usuario
					userTaskCompletionStep.remove(chatId); // Limpiar el paso actual
					showTaskDetails(chatId, task);
				} catch (Exception e) {
					sendMessage(chatId, "⚠️ Invalid date and time format. Please use `YYYY/MM/DD HH:mm`:");
					logger.error("Error parsing date: " + messageText, e);
				}
			}
		} catch (Exception e) {
			logger.error("Error completing task: " + e.getMessage(), e);
			sendMessage(chatId, "An error occurred while completing the task. Please try again.");
		}
	}

	private OffsetDateTime parseDateTimeInput(String input) throws Exception {
		try {
			// Reemplazar "/" con "-" para que coincida con el formato esperado
			String formattedInput = input.replace("/", "-");
	
			// Reemplazar el espacio con "T" y agregar "Z" al final
			formattedInput = formattedInput.replace(" ", "T") + "Z";
	
			// Parsear la fecha al formato OffsetDateTime
			return OffsetDateTime.parse(formattedInput);
		} catch (Exception e) {
			throw new Exception("Invalid date and time format. Please use `YYYY/MM/DD HH:mm`.");
		}
	}

    private String formatTaskDetails(Task task) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        String creationDate = task.getCreationDate().format(formatter);
        String realHours = task.getRealHours() != null ? task.getRealHours().toString() : "Not Finished";

		String estimatedFinishDate = task.getEstimatedFinishDate() != null ? task.getEstimatedFinishDate().format(formatter) : "Not Set";
		String realFinishDate = task.getRealFinishDate() != null ? task.getRealFinishDate().format(formatter) : "Not Finished";

		return String.format(
			"🆔 %d\n📄 %s\n📌 %s\n🚀 Sprint: %s\n🕰️ Created: %s\n⏳ Estimated Hours: %d\n🔑 Priority: %d\n👤 User: %s\n🏁 Real Hours: %s\n📅 Estimated Finish Date: %s\n📅 Real Finish Date: %s\n\n",
			task.getTaskId(), task.getDescription(), task.getStatus(), task.getSprint().getSprintName(),
			creationDate, task.getEstimatedHours(), task.getPriority(), task.getUser().getName(), realHours,
			estimatedFinishDate, realFinishDate
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

	private void showKpis(long chatId) {
		try {
			String fechaConsulta = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
			
			// Llamar al servicio para obtener los KPIs
			KpiResponse kpiResponse = taskService.getComplianceRateKpis(fechaConsulta);
	
			// Formatear los datos de los KPIs del proyecto
			StringBuilder kpiMessage = new StringBuilder("📊 *Project KPIs Overview:*\n\n");
	
			// Compliance Rate para proyectos
			kpiMessage.append("*Compliance Rate:*\n");
			kpiMessage.append("📂 *Projects:*\n").append(formatKpiDataWithIcons(kpiResponse.getComplianceRate().get("projects")));
	
			// Estimation Precision para proyectos
			kpiMessage.append("\n*Estimation Precision:*\n");
			kpiMessage.append("📂 *Projects:*\n").append(formatKpiDataWithIcons(kpiResponse.getEstimationPrecision().get("projects")));
	
			// Enviar el mensaje al usuario
			sendMessage(chatId, kpiMessage.toString());
		} catch (Exception e) {
			logger.error("Error fetching project KPIs: " + e.getMessage(), e);
			sendMessage(chatId, "⚠️ An error occurred while fetching project KPIs. Please try again later.");
		}
	}

	private void showUsersForKpis(long chatId) {
		List<User> users = getAllUsers();
		if (users.isEmpty()) {
			sendMessage(chatId, "No users found.");
			return;
		}
	
		List<KeyboardRow> keyboard = new ArrayList<>();
		for (User user : users) {
			keyboard.add(createRow("User KPIs: " + user.getUserId() + " - " + user.getName()));
		}
	
		sendKeyboard(chatId, "Select a user to view their KPIs:", keyboard);
	}

	private void showKpisByUser(long chatId, String messageText) {
		try {
			// Extraer el ID del usuario del mensaje
			String[] parts = messageText.split(":")[1].trim().split(" - ");
			int userId = Integer.parseInt(parts[0]);

			String fechaConsulta = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	
			// Obtener los KPIs del usuario
			KpiResponse kpiResponse = taskService.getKpisByUserId(userId, fechaConsulta);
	
			// Formatear los datos de los KPIs
			StringBuilder kpiMessage = new StringBuilder("📊 *KPIs for User: " + parts[1] + "*\n\n");
			kpiMessage.append("📈 *Compliance Rate:*\n");
			kpiMessage.append(formatKpiDataWithIcons(kpiResponse.getComplianceRate().get("users")));
			kpiMessage.append("\n📏 *Estimation Precision:*\n");
			kpiMessage.append(formatKpiDataWithIcons(kpiResponse.getEstimationPrecision().get("users")));
	
			// Enviar el mensaje al usuario
			sendMessage(chatId, kpiMessage.toString());
		} catch (Exception e) {
			logger.error("Error fetching KPIs for user: " + e.getMessage(), e);
			sendMessage(chatId, "⚠️ An error occurred while fetching KPIs for the user. Please try again.");
		}
	}

	private void showSprintsForKpis(long chatId) {
		List<Sprint> sprints = getAllSprints();
		if (sprints.isEmpty()) {
			sendMessage(chatId, "No sprints found.");
			return;
		}
	
		List<KeyboardRow> keyboard = new ArrayList<>();
		for (Sprint sprint : sprints) {
			keyboard.add(createRow("Sprint KPIs: " + sprint.getSprintId() + " - " + sprint.getSprintName()));
		}
	
		sendKeyboard(chatId, "Select a sprint to view its KPIs:", keyboard);
	}

	private void showKpisBySprint(long chatId, String messageText) {
		try {
			// Extraer el ID del sprint del mensaje
			String[] parts = messageText.split(":")[1].trim().split(" - ");
			int sprintId = Integer.parseInt(parts[0]);
	
			// Obtener la fecha de consulta
			String fechaConsulta = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	
			// Obtener los KPIs del sprint con la fecha de consulta
			KpiResponse kpiResponse = taskService.getKpisBySprintId(sprintId, fechaConsulta);
	
			// Formatear los datos de los KPIs
			StringBuilder kpiMessage = new StringBuilder("📊 *KPIs for Sprint: " + parts[1] + "*\n\n");
			kpiMessage.append("📈 *Compliance Rate:*\n");
			kpiMessage.append(formatKpiDataWithIcons(kpiResponse.getComplianceRate().get("sprints")));
			kpiMessage.append("\n📏 *Estimation Precision:*\n");
			kpiMessage.append(formatKpiDataWithIcons(kpiResponse.getEstimationPrecision().get("sprints")));
	
			// Enviar el mensaje al usuario
			sendMessage(chatId, kpiMessage.toString());
		} catch (Exception e) {
			logger.error("Error fetching KPIs for sprint: " + e.getMessage(), e);
			sendMessage(chatId, "⚠️ An error occurred while fetching KPIs for the sprint. Please try again.");
		}
	}

	private String formatKpiDataWithIcons(List<Map<String, Object>> kpiData) {
		if (kpiData == null || kpiData.isEmpty()) {
			return "❌ No data available.\n";
		}
	
		StringBuilder formattedData = new StringBuilder();
		for (Map<String, Object> entry : kpiData) {
			for (Map.Entry<String, Object> field : entry.entrySet()) {
				String key = field.getKey();
				Object value = field.getValue();
	
				// Agregar emojis y etiquetas según el campo
				switch (key.toLowerCase()) {
					case "id":
						formattedData.append("🆔 *ID:* ").append(value).append("\n");
						break;
					case "name":
						formattedData.append("👤 *Name:* ").append(value).append("\n");
						break;
					case "tareas_a_tiempo":
						formattedData.append("⏳ *On Time Tasks:* ").append(value).append("\n");
						break;
					case "tareas_completadas":
						formattedData.append("✅ *Completed Tasks:* ").append(value).append("\n");
						break;
					case "tareas_en_progreso":
						formattedData.append("🔄 *In Progress Tasks:* ").append(value).append("\n");
						break;
					case "tareas_por_hacer":
						formattedData.append("📋 *To Do Tasks:* ").append(value).append("\n");
						break;
					case "tareas_bloqueadas":
						formattedData.append("🚫 *Blocked Tasks:* ").append(value).append("\n");
						break;
					case "tasa_cumplimiento":
						formattedData.append("📊 *Compliance Rate:* ").append(value).append("%\n");
						break;
					case "horas_estimadas":
						formattedData.append("⏱️ *Estimated Hours:* ").append(value).append("\n");
						break;
					case "horas_reales":
						formattedData.append("🕒 *Real Hours:* ").append(value).append("\n");
						break;
					case "desviacion_promedio_dias":
						formattedData.append("📅 *Average Deviation (Days):* ").append(value).append("\n");
						break;
					case "desviacion_promedio_horas":
						formattedData.append("⏳ *Average Deviation (Hours):* ").append(value).append("\n");
						break;
					case "tareas_totales":
						formattedData.append("🔰 *Total Tasks:* ").append(value).append("\n");
						break;
					default:
						formattedData.append("• ").append(key).append(": ").append(value).append("\n");
						break;
				}
			}
			formattedData.append("\n");
		}
		return formattedData.toString();
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


    /**
     * Combines the action schema, current date/time, and the user instruction into a prompt.
     */
    private String buildAiPrompt(String userInstruction, String currentDateTime) {
        String actionSchema = "Action Schema:\n"
                + "- create_task: Required fields: TASK_NAME, DESCRIPTION, PRIORITY, ESTIMATED_FINISH_DATE, SPRINT_ID, USER_ID\n"
                + "- update_task_status: Required fields: TASK_ID, STATUS; Optional fields: REAL_HOURS, REAL_FINISH_DATE\n";
        return String.format(
                "You are a backend system for a Telegram task management bot. "
              + "Your task is to convert the following user instruction into a valid JSON action "
              + "that strictly adheres to the defined action schema. "
              + "Context: The current system date and time is %s. "
              + "Any natural language date/time expressions should be parsed into ISO 8601 format.\n\n"
              + "%s\n\n"
              + "User instruction: \"%s\"\n\n"
              + "Your output must be strictly valid JSON with no additional text.",
              currentDateTime, actionSchema, userInstruction);
    }

    /**
     * Caches the AI action along with its validation errors so that later user input
     * can be used to correct the action.
     */
    private void cacheAiActionForCorrection(long chatId, Action aiAction, List<String> validationErrors) {
        aiCorrectionMap.put(chatId, new AiActionCorrection(aiAction, validationErrors));
        // Optionally, log or send additional info to the user.
    }

    /**
     * Processes a valid AI-generated action by converting it into a task (if create_task)
     * and calling the existing domain execution routines.
     */
	private void processValidAction(Action aiAction, long chatId) {
		if ("create_task".equalsIgnoreCase(aiAction.getAction())) {
			Task task = new Task();
			// Populate fields from the AI action
			task.setTaskName(aiAction.getParams().get("TASK_NAME").toString());
			task.setDescription(aiAction.getParams().get("DESCRIPTION").toString());
			task.setPriority(Integer.parseInt(aiAction.getParams().get("PRIORITY").toString()));
			// Similarly set estimated finish date, sprint id, user id, etc.
			taskService.addTask(task);
			clearUserCreationState(chatId);
			sendMessage(chatId, "✅ Task created successfully via AI command!");
			showMainMenu(chatId);
		} else {
			sendMessage(chatId, "⚠️ Action type '" + aiAction.getAction() + "' not supported.");
		}
	}
}