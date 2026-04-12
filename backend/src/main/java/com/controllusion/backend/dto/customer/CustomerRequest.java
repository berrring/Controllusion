package com.controllusion.backend.dto.customer;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record CustomerRequest(
        @NotBlank(message = "Customer name is required.")
        @Size(max = 120, message = "Customer name must be 120 characters or fewer.")
        String fullName,

        @NotBlank(message = "Email is required.")
        @Email(message = "Enter a valid email address.")
        String email,

        @NotBlank(message = "Phone number is required.")
        @Size(max = 40, message = "Phone number must be 40 characters or fewer.")
        String phone,

        @NotBlank(message = "Company is required.")
        @Size(max = 160, message = "Company must be 160 characters or fewer.")
        String company,

        @Size(max = 120, message = "Job title must be 120 characters or fewer.")
        String jobTitle,

        @NotBlank(message = "Status is required.")
        String status,

        @NotBlank(message = "Stage is required.")
        String stage,

        @NotNull(message = "Deal value is required.")
        @DecimalMin(value = "0.0", inclusive = true, message = "Deal value must be zero or greater.")
        BigDecimal dealValue,

        @Size(max = 4000, message = "Notes must be 4000 characters or fewer.")
        String notes,

        @Size(max = 160, message = "Location must be 160 characters or fewer.")
        String location,

        @Size(max = 120, message = "Industry must be 120 characters or fewer.")
        String industry
) {
}
