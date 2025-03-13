package com.springboot.MyTodoList.controller;

import com.springboot.MyTodoList.model.AuthenticationRequest;
import com.springboot.MyTodoList.model.AuthenticationResponse;
import com.springboot.MyTodoList.security.JwtUtil;
import com.springboot.MyTodoList.model.User;
import com.springboot.MyTodoList.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Permitir peticiones desde cualquier origen
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthenticationRequest authRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // Obtener UserDetails para futuras autorizaciones
        UserDetails userDetails = userService.loadUserByUsername(authRequest.getEmail());

        // Obtener el usuario completo desde la base de datos
        Optional<User> userOptional = userService.findByEmail(authRequest.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }
        User user = userOptional.get();

        // Generar token JWT con UserDetails
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());

        // Devolver JWT + User completo
        return ResponseEntity.ok(new AuthenticationResponse(jwt, user));
    }

}