package com.foodwaste.service;

import com.foodwaste.dto.AuthResponse;
import com.foodwaste.dto.LoginRequest;
import com.foodwaste.dto.RegisterRequest;
import com.foodwaste.model.Role;
import com.foodwaste.model.User;
import com.foodwaste.repository.UserRepository;
import com.foodwaste.security.JwtUtils;
import com.foodwaste.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return AuthResponse.builder()
            .token(jwt)
            .type("Bearer")
            .id(userDetails.getId())
            .name(userDetails.getName())
            .email(userDetails.getUsername())
            .role(user.getRole())
            .city(user.getCity())
            .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }
        if (request.getPhone() != null && userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone number is already registered");
        }
        // Only allow DONOR, NGO, VOLUNTEER — not ADMIN via public registration
        if (request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot register as ADMIN");
        }

        User user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .address(request.getAddress())
            .city(request.getCity())
            .role(request.getRole())
            .orgName(request.getOrgName())
            .registrationNumber(request.getRegistrationNumber())
            .isActive(true)
            .build();

        userRepository.save(user);

        // Auto-login after register
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(request.getEmail());
        loginRequest.setPassword(request.getPassword());
        return login(loginRequest);
    }
}
