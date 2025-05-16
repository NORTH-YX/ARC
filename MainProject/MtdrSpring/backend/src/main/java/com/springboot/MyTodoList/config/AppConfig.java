package com.springboot.MyTodoList.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.client.SimpleClientHttpRequestFactory;

@Configuration
public class AppConfig {

    /**
     * RestTemplate bean for making HTTP requests to external services
     * Used by the AI Manager service to communicate with LLM APIs
     */
    @Bean
    public RestTemplate restTemplate() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        // Set timeout for API calls
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(30000); // LLMs might need more time to respond
        return new RestTemplate(factory);
    }
} 