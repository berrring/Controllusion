package com.controllusion.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(
        @NotBlank(message = "Current password is required.")
        String currentPassword,

        @NotBlank(message = "New password is required.")
        @Size(min = 8, max = 120, message = "New password must be between 8 and 120 characters.")
        String newPassword,

        @NotBlank(message = "Confirm the new password.")
        String confirmNewPassword
) {
}
