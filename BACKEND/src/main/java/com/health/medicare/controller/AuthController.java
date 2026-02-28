package com.health.medicare.controller;

import com.health.medicare.dto.request.LoginRequestDto;
import com.health.medicare.dto.request.RegistrationRequestDto;
import com.health.medicare.dto.response.LoginResponseDto;
import com.health.medicare.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        LoginResponseDto response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDto> register(@Valid @RequestBody RegistrationRequestDto request) {
        LoginResponseDto response = authService.register(request);
        return ResponseEntity.ok(response);
    }
}