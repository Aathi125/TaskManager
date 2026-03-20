package com.taskManagement.backend.controller;

import com.taskManagement.backend.model.User;
import com.taskManagement.backend.repository.UserRepository;
import com.taskManagement.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Register
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userRepository.save(user); // simple, no encryption for demo
    }

    // Login
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody User user) {
        User existing = userRepository.findByUsername(user.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existing.getPassword().equals(user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(existing.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return response;
    }
}
