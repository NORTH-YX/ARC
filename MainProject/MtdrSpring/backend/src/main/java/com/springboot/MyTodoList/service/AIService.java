package com.springboot.MyTodoList.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.model.Action;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.io.OutputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.time.OffsetDateTime;

/**
 * AIService is responsible for building a dynamic prompt that includes the current date/time context,
 * sending the prompt to the OpenAI API, and parsing the JSON response into an Action object.
 */
public class AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIService.class);
    private final String apiUrl;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public AIService(String apiUrl, String apiKey) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Sends a user instruction along with context as a prompt to the AI API and returns an Action object.
     * The method first obtains the raw API response, parses it to extract the message content,
     * then interprets that content as JSON representing the action.
     *
     * @param userInstruction The natural language instruction.
     * @return Parsed Action object from the API response, or null if an error occurs.
     */
    public Action obtainAiAction(String userInstruction) {
        try {
            String prompt = buildPrompt(userInstruction);
            String responseJson = callOpenAiApi(prompt);
            // Parse the full OpenAI response
            OpenAiResponse openAiResponse = objectMapper.readValue(responseJson, OpenAiResponse.class);
            if (openAiResponse != null && openAiResponse.choices != null && !openAiResponse.choices.isEmpty()) {
                String content = openAiResponse.choices.get(0).message.content;
                logger.debug("Extracted message content: " + content);
                // Parse the content JSON into a map structure
                Map<String, Map<String, Object>> map = objectMapper.readValue(content, 
                        new TypeReference<Map<String, Map<String, Object>>>(){});
                if (map != null && !map.isEmpty()) {
                    // We assume the first entry is our action.
                    Map.Entry<String, Map<String, Object>> entry = map.entrySet().iterator().next();
                    Action action = new Action();
                    action.setAction(entry.getKey());
                    action.setParams(entry.getValue());
                    return action;
                }
            }
            return null;
        } catch (Exception e) {
            logger.error("Error obtaining AI action: " + e.getMessage(), e);
            return null;
        }
    }

    /**
     * Builds a prompt by adding current date/time context to the user instruction.
     *
     * @param userInstruction The original instruction from the user.
     * @return The full prompt string sent to the AI API.
     */
    private String buildPrompt(String userInstruction) {
        OffsetDateTime now = OffsetDateTime.now();
        String currentDateTime = now.toString(); // ISO 8601 format including time zone

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
              + "Your output must be strictly valid JSON with no additional text."
              + "Do not wrap your JSON in backticks or provide any commentary."
              + "Any fields that are not metioned in the instruction should be set to null.\n",
              currentDateTime, actionSchema, userInstruction);
    }

    /**
     * Makes an HTTP POST request to the AI API with a robust JSON payload using ObjectMapper.
     * Logs and throws an error if the response code is not 200 OK.
     *
     * @param prompt The prompt to send to the API.
     * @return The API response as a String.
     * @throws Exception if an error occurs during the API call.
     */
    private String callOpenAiApi(String prompt) throws Exception {
        URL url = new URL(apiUrl);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");
        conn.setRequestProperty("Authorization", "Bearer " + apiKey);
        conn.setDoOutput(true);

        // Build payload using a Map and let ObjectMapper generate JSON.
        Map<String, Object> requestMap = new HashMap<>();
        requestMap.put("model", "gpt-4");
        requestMap.put("temperature", 0);
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        List<Map<String, String>> messages = List.of(message);
        requestMap.put("messages", messages);

        String payload = objectMapper.writeValueAsString(requestMap);
        logger.debug("AI Request Payload: " + payload);

        try (OutputStream os = conn.getOutputStream()) {
            os.write(payload.getBytes(StandardCharsets.UTF_8));
        }

        int responseCode = conn.getResponseCode();
        if (responseCode != HttpURLConnection.HTTP_OK) {
            // Read error message from the API
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(conn.getErrorStream(), StandardCharsets.UTF_8));
            StringBuilder errorResponse = new StringBuilder();
            String errorLine;
            while ((errorLine = errorReader.readLine()) != null) {
                errorResponse.append(errorLine.trim());
            }
            errorReader.close();
            logger.error("Error response from OpenAI API: " + errorResponse.toString());
            throw new IOException("Server returned HTTP response code: " + responseCode + " for URL: " + apiUrl);
        }

        BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8));
        StringBuilder response = new StringBuilder();
        String responseLine;
        while ((responseLine = in.readLine()) != null) {
            response.append(responseLine.trim());
        }
        in.close();
        logger.debug("AI API Response: " + response.toString());
        return response.toString();
    }

    // Helper classes to model the structure of the OpenAI API response

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenAiResponse {
        public List<Choice> choices;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Choice {
        public Message message;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Message {
        public String role;
        public String content;
    }
}