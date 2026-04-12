package com.controllusion.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @NotBlank(message = "Full name is required.")
        @Size(max = 120, message = "Full name must be 120 characters or fewer.")
        String fullName,

        @NotBlank(message = "Email is required.")
        @Email(message = "Enter a valid email address.")
        String email,

        @Size(max = 40, message = "Phone number must be 40 characters or fewer.")
        String phone,

        @Size(max = 120, message = "Job title must be 120 characters or fewer.")
        String title,

        @Size(max = 20, message = "Theme preference must be 20 characters or fewer.")
        String themePreference
) {
}
