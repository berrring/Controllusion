package com.controllusion.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(
        @Size(max = 120, message = "Full name must be 120 characters or fewer.")
        String fullName,

        @Email(message = "Enter a valid email address.")
        String email,

        String role,

        Boolean isActive,

        @Size(max = 120, message = "Title must be 120 characters or fewer.")
        String title,

        @Size(max = 40, message = "Phone number must be 40 characters or fewer.")
        String phone
) {
}
