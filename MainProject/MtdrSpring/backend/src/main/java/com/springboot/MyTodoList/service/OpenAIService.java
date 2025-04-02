package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Action;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.*;
import java.util.*;

@Service
public class OpenAIService {
    private static final String OPENAI_API_KEY = System.getenv("OPENAI_API_KEY");
    private static final String OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
    private static final ObjectMapper mapper = new ObjectMapper();

    public List<Action> extractActions(String userInput) throws Exception {
        String prompt = generatePrompt(userInput);

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(OPENAI_ENDPOINT))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + OPENAI_API_KEY)
            .POST(HttpRequest.BodyPublishers.ofString(buildRequestJson(prompt)))
            .build();

        HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());

        // Extract content from OpenAI response JSON
        JsonNode content = mapper.readTree(response.body())
                                 .path("choices").get(0)
                                 .path("message").path("content");

        return List.of(mapper.readValue(content.toString(), Action[].class));
    }

    private String generatePrompt(String userInput) {
        return "Tu tarea es interpretar una instrucción y generar acciones en formato JSON válido. Instrucción: \"" + userInput + "\"";
    }

    private String buildRequestJson(String prompt) throws Exception {
        ObjectNode root = mapper.createObjectNode();
        root.put("model", "gpt-4");

        ArrayNode messages = mapper.createArrayNode();
        ObjectNode userMsg = mapper.createObjectNode();
        userMsg.put("role", "user");
        userMsg.put("content", prompt);
        messages.add(userMsg);

        root.set("messages", messages);
        root.put("temperature", 0);
        return mapper.writeValueAsString(root);
    }
}
