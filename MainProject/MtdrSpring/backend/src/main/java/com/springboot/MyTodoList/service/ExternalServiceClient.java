package com.springboot.MyTodoList.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.MyTodoList.model.Action;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExternalServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(ExternalServiceClient.class);
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    @Value("${nlp.service.url}")
    private String nlpServiceUrl;

    @Value("${correction.service.url}")
    private String correctionServiceUrl;

    public Action callNlpService(String userInput) {
        try {
            logger.debug("Calling NLP service with input: {}", userInput);
            Map<String, String> requestPayload = new HashMap<>();
            requestPayload.put("input", userInput);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestPayload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(nlpServiceUrl, requestEntity, Map.class);
            logger.debug("NLP service response status: {}", response.getStatusCode());
            if (response.getStatusCode() == HttpStatus.OK) {
                Map body = response.getBody();
                List<Map<String, Object>> actionsList = (List<Map<String, Object>>) body.get("actions");
                if (actionsList != null && !actionsList.isEmpty()) {
                    Map<String, Object> actionMap = actionsList.get(0);
                    Action action = new Action();
                    action.setAction((String) actionMap.get("action"));
                    action.setParams((Map<String, Object>) actionMap.get("params"));
                    return action;
                }
            }
        } catch (Exception e) {
            logger.error("Error calling NLP service", e);
        }
        return null;
    }

    public String callCorrectionService(String actionJson, String errors) {
        try {
            Map<String, String> payload = new HashMap<>();
            payload.put("action", actionJson);
            payload.put("errors", errors);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(correctionServiceUrl, requestEntity, Map.class);
            logger.debug("Correction service response: {}", response.getBody());
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Object corrected = responseBody.get("corrected_action");
                if (corrected != null) {
                    return corrected.toString();
                }
            }
        } catch (Exception e) {
            logger.error("Error calling correction service", e);
        }
        return null;
    }
}