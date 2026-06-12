package com.civicsync.CivicSync_Backend.controller;

import com.civicsync.CivicSync_Backend.entity.User;
import com.civicsync.CivicSync_Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Use BCrypt to safely hash plain text passwords
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 🔑 1. TRADITIONAL REGISTRATION
    @PostMapping("/register")
    public Object registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return Map.of("error", "Email already exists!");
        }

        // 🚨 FIX: Enforce phone number validation check to prevent database NOT NULL failures
        if (user.getPhoneNumber() == null || user.getPhoneNumber().trim().isEmpty()) {
            return Map.of("error", "Phone number is required for Tamil Nadu Civic Sync registration!");
        }

        if (userRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
            return Map.of("error", "Phone number is already registered!");
        }

        // Set default enterprise configurations
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setRole("CITIZEN");
        user.setIsVerified(false); // Changes to TRUE after future Aadhaar/OTP integration

        User savedUser = userRepository.save(user);
        return Map.of(
                "message", "User registered successfully!",
                "userId", savedUser.getId()
        );
    }

    // 🔐 2. TRADITIONAL LOGIN
    @PostMapping("/login")
    public Object loginUser(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return Map.of("error", "User not found");
        }

        User user = userOpt.get();
        // Check if entered password matches encrypted password hash
        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            return Map.of(
                    "message", "Login successful",
                    "userId", user.getId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            );
        } else {
            return Map.of("error", "Invalid credentials");
        }
    }

    // 🌐 3. GOOGLE SIGN-IN INTEGRATION ENDPOINT
    @PostMapping("/google")
    public Object googleLogin(@RequestBody Map<String, String> googleData) {
        String email = googleData.get("email");
        String name = googleData.get("name");
        String googleId = googleData.get("googleId");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();
            // Link googleId if not linked yet
            if (existingUser.getGoogleId() == null) {
                existingUser.setGoogleId(googleId);
                userRepository.save(existingUser);
            }
            return Map.of(
                    "message", "Login successful via Google",
                    "userId", existingUser.getId(),
                    "name", existingUser.getName()
            );
        }

        // New user signing up with Google for the first time
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setGoogleId(googleId);

        // 🚨 FIX: Generate a unique fallback string placeholder for the phone number
        // to prevent Google Sign-In loops from throwing structural SQL errors.
        String dummyPhone = "+91" + UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 10);
        newUser.setPhoneNumber(dummyPhone);

        // Google auth doesn't supply a standard password; seed a secure random string hash representation
        newUser.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
        newUser.setRole("CITIZEN");
        newUser.setIsVerified(false);

        User savedUser = userRepository.save(newUser);

        return Map.of(
                "message", "Account created via Google successfully",
                "userId", savedUser.getId(),
                "name", savedUser.getName()
        );
    }
}