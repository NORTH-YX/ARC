package com.springboot.MyTodoList.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;


import java.util.Collections;
import java.util.List;
/*
    This class configures CORS, and specifies which methods are allowed
    along with which origins and headers
    @author: peter.song@oracle.com

 */
@Configuration
public class CorsConfig {
    Logger logger = LoggerFactory.getLogger(CorsConfig.class);
    
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite cualquier origen dinámicamente
        config.setAllowedOriginPatterns(Collections.singletonList("*")); 

        // Métodos permitidos
        config.setAllowedMethods(List.of("GET","POST","PUT","OPTIONS","DELETE","PATCH"));

        // Encabezados permitidos
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));

        // Expone encabezados
        config.addExposedHeader("location");

        // Permite credenciales
        config.setAllowCredentials(true);

        // Configuración de CORS
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

