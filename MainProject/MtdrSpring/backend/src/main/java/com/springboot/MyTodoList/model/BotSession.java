package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "BOT_SESSIONS")
public class BotSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // El chat_id de Telegram
    private Long chatId;
    
    // El contexto de la acción en formato JSON
    @Lob
    private String contextJson;
    
    // Fecha de la última actualización
    private LocalDateTime lastUpdated;

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public String getContextJson() {
        return contextJson;
    }

    public void setContextJson(String contextJson) {
        this.contextJson = contextJson;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}