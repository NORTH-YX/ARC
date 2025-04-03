package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.BotSession;
import com.springboot.MyTodoList.repository.BotSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BotSessionService {

    @Autowired
    private BotSessionRepository repository;
    
    // Recupera la sesión para un chat
    public Optional<BotSession> getSession(Long chatId) {
        return repository.findByChatId(chatId);
    }
    
    // Guarda o actualiza la sesión
    public BotSession saveSession(BotSession session) {
        session.setLastUpdated(LocalDateTime.now());
        return repository.save(session);
    }
    
    // Elimina la sesión
    public void deleteSession(Long chatId) {
        repository.findByChatId(chatId).ifPresent(session -> repository.delete(session));
    }
    
    // Método para limpiar sesiones caducadas
    public void cleanExpiredSessions(Duration expiration) {
        LocalDateTime cutoff = LocalDateTime.now().minus(expiration);
        List<BotSession> expired = repository.findAll().stream()
            .filter(s -> s.getLastUpdated().isBefore(cutoff))
            .collect(Collectors.toList());
        repository.deleteAll(expired);
    }
    
    // Programación para limpiar sesiones caducadas cada 10 minutos
    @Scheduled(fixedRate = 600000) // 600,000 ms = 10 minutos
    public void cleanOldSessions() {
        cleanExpiredSessions(Duration.ofMinutes(15)); // Expiran sesiones de 15 minutos
    }
}
