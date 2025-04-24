package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.springboot.MyTodoList.dto.UserResponse;

@RestController
@RequestMapping("api/users")
@CrossOrigin(origins = "*") // Permitir peticiones desde cualquier origen
public class UsersController {

    @Autowired
    private UserService userService;

    // Obtener todos los usuarios
    @GetMapping
    public ResponseEntity<UserResponse> getAllUsers() {
        List<User> users = userService.findAll();
        UserResponse response = new UserResponse(users);
        return ResponseEntity.ok(response);
    }

    // Obtener un usuario por ID usando @RequestParam
    @GetMapping("/by-id")
    public ResponseEntity<User> getUserById(@RequestParam int id) {
        Optional<User> user = userService.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Obtener un usuario por email usando @RequestParam
    @GetMapping("/by-email")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        Optional<User> user = userService.findByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Crear un usuario usando @RequestParam en lugar de @RequestBody
    @PostMapping("/create")
    //crea el usuario con cada uno de los parametros necesarios
    public ResponseEntity<User> createUser(@RequestParam String name, @RequestParam String email, @RequestParam String role,
                                           @RequestParam String workModality, @RequestParam String telegramId, @RequestParam String phoneNumber,
                                           @RequestParam String password, @RequestParam int teamId) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setRole(role);
        user.setWorkModality(workModality);
        user.setTelegramId(telegramId);
        user.setPhoneNumber(phoneNumber);
        user.setPassword(password);
        user.setTeamId(teamId);
        User newUser = userService.save(user);
        return ResponseEntity.ok(newUser);
    }

    // Eliminar un usuario usando @RequestParam en lugar de @PathVariable
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestParam int id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
