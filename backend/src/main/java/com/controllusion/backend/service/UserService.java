package com.controllusion.backend.service;

import com.controllusion.backend.dto.user.InviteUserRequest;
import com.controllusion.backend.dto.user.UpdateUserRequest;
import com.controllusion.backend.dto.user.UserResponse;
import com.controllusion.backend.entity.User;
import com.controllusion.backend.entity.UserRole;
import com.controllusion.backend.exception.DuplicateResourceException;
import com.controllusion.backend.exception.ResourceNotFoundException;
import com.controllusion.backend.mapper.UserMapper;
import com.controllusion.backend.repository.UserRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final String inviteTemporaryPassword;

    public UserService(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            @Value("${app.invite.temporary-password}") String inviteTemporaryPassword
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.inviteTemporaryPassword = inviteTemporaryPassword;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getUsers() {
        return userRepository.findAll().stream()
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .map(userMapper::toResponse)
                .toList();
    }

    public UserResponse inviteUser(InviteUserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DuplicateResourceException("A user with this email already exists.");
        }

        User user = new User();
        user.setFullName(request.fullName().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(inviteTemporaryPassword));
        user.setRole(UserRole.fromValue(request.role()));
        user.setActive(true);
        user.setTitle(request.title() != null && !request.title().isBlank() ? request.title().trim() : "Team Member");
        user.setThemePreference("light");

        return userMapper.toResponse(userRepository.save(user));
    }

    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = findUserEntity(userId);

        if (request.email() != null && !request.email().isBlank()) {
            String normalizedEmail = request.email().trim().toLowerCase();
            if (userRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, userId)) {
                throw new DuplicateResourceException("A user with this email already exists.");
            }
            user.setEmail(normalizedEmail);
        }

        if (request.fullName() != null && !request.fullName().isBlank()) {
            user.setFullName(request.fullName().trim());
        }

        if (request.title() != null) {
            user.setTitle(request.title().isBlank() ? null : request.title().trim());
        }

        if (request.phone() != null) {
            user.setPhone(request.phone().isBlank() ? null : request.phone().trim());
        }

        if (request.role() != null && !request.role().isBlank()) {
            user.setRole(UserRole.fromValue(request.role()));
        }

        if (request.isActive() != null) {
            user.setActive(request.isActive());
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public User findUserEntity(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }
}
