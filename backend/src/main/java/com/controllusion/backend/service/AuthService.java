package com.controllusion.backend.service;

import com.controllusion.backend.dto.auth.AuthResponse;
import com.controllusion.backend.dto.auth.ChangePasswordRequest;
import com.controllusion.backend.dto.auth.LoginRequest;
import com.controllusion.backend.dto.auth.RegisterRequest;
import com.controllusion.backend.dto.auth.UpdateProfileRequest;
import com.controllusion.backend.dto.common.ApiMessageResponse;
import com.controllusion.backend.dto.user.UserResponse;
import com.controllusion.backend.entity.User;
import com.controllusion.backend.entity.UserRole;
import com.controllusion.backend.exception.BadRequestException;
import com.controllusion.backend.exception.DuplicateResourceException;
import com.controllusion.backend.exception.ForbiddenOperationException;
import com.controllusion.backend.mapper.UserMapper;
import com.controllusion.backend.repository.UserRepository;
import com.controllusion.backend.security.JwtService;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            UserMapper userMapper,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException("An account with this email already exists.");
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(UserRole.USER);
        user.setActive(true);
        user.setTitle("Sales Representative");
        user.setThemePreference("light");

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password.");
        }

        if (!user.isActive()) {
            throw new ForbiddenOperationException("Your account is disabled. Contact an administrator.");
        }

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        return userMapper.toResponse(findActiveUser(userId));
    }

    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = findActiveUser(userId);
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, userId)) {
            throw new DuplicateResourceException("This email is already in use by another account.");
        }

        user.setFullName(request.fullName().trim());
        user.setEmail(normalizedEmail);
        user.setPhone(request.phone() == null || request.phone().isBlank() ? null : request.phone().trim());
        user.setTitle(request.title() == null || request.title().isBlank() ? null : request.title().trim());
        user.setThemePreference(
                request.themePreference() == null || request.themePreference().isBlank()
                        ? "light"
                        : request.themePreference().trim().toLowerCase(Locale.ROOT)
        );

        return userMapper.toResponse(userRepository.save(user));
    }

    public ApiMessageResponse changePassword(UUID userId, ChangePasswordRequest request) {
        if (!request.newPassword().equals(request.confirmNewPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }

        User user = findActiveUser(userId);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return new ApiMessageResponse("Password updated successfully.", true);
    }

    public ApiMessageResponse logout() {
        return new ApiMessageResponse("Logged out successfully.", true);
    }

    @Transactional(readOnly = true)
    public User findActiveUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadCredentialsException("Authentication is required."));

        if (!user.isActive()) {
            throw new ForbiddenOperationException("This account is currently disabled.");
        }

        return user;
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = jwtService.generateToken(user);
        return new AuthResponse(token, userMapper.toResponse(user));
    }
}
