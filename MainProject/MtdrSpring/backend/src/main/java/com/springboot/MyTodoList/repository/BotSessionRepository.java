package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.BotSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface BotSessionRepository extends JpaRepository<BotSession, Long> {
    Optional<BotSession> findByChatId(Long chatId);
}