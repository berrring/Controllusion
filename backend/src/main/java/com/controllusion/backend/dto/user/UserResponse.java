package com.controllusion.backend.dto.user;

import java.time.Instant;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String fullName,
        String email,
        String role,
        boolean isActive,
        String title,
        String phone,
        String themePreference,
        Instant createdAt,
        Instant updatedAt
) {
}
