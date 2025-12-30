package com.sms.auth.service;

import com.sms.auth.dto.AuthRequest;
import com.sms.auth.dto.AuthResponse;
import com.sms.auth.entity.User;
import com.sms.auth.repository.UserRepository;
import com.sms.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        
        // Update last login
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(userDetails);

        return AuthResponse.builder()
                .accessToken(token)
                .username(user.getUsername())
                .role(user.getRole().name())
                .build();
    }

    public String forgotPassword(String identifier) {
        User user = userRepository.findByEmail(identifier)
                .or(() -> userRepository.findByMobile(identifier))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // In a real app, send email/SMS here
        System.out.println("--------------------------------");
        System.out.println("GENERATED OTP FOR " + identifier + ": " + otp);
        System.out.println("--------------------------------");

        // Ideally save OTP in DB with expiration (Simplifying for now)
        return "OTP sent successfully to " + identifier;
    }
}
