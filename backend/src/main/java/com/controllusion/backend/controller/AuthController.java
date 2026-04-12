package com.controllusion.backend.controller;

import com.controllusion.backend.dto.auth.AuthResponse;
import com.controllusion.backend.dto.auth.ChangePasswordRequest;
import com.controllusion.backend.dto.auth.LoginRequest;
import com.controllusion.backend.dto.auth.RegisterRequest;
import com.controllusion.backend.dto.auth.UpdateProfileRequest;
import com.controllusion.backend.dto.common.ApiMessageResponse;
import com.controllusion.backend.dto.user.UserResponse;
import com.controllusion.backend.security.UserPrincipal;
import com.controllusion.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(authService.getCurrentUser(principal.getUserId()));
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(authService.updateProfile(principal.getUserId(), request));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiMessageResponse> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(authService.changePassword(principal.getUserId(), request));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiMessageResponse> logout() {
        return ResponseEntity.ok(authService.logout());
    }
}
