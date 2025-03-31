package com.springboot.MyTodoList.repository;

import com.springboot.MyTodoList.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email); // Método para buscar usuario por email
    Optional<User> findByTelegramId(String telegramId); // Método para buscar usuario por telegramId
}
