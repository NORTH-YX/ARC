package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    public List<User> findAll() {
        return usersRepository.findAll();
    }

    public Optional<User> findById(int id) {
        return usersRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    @Transactional
    public User save(User user) {
        return usersRepository.save(user);
    }

    @Transactional
    public void deleteById(int id) {
        usersRepository.deleteById(id);
    }
}
