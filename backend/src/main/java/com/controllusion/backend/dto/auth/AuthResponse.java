package com.controllusion.backend.dto.auth;

import com.controllusion.backend.dto.user.UserResponse;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
