package com.controllusion.backend.entity;

public enum UserRole {
    ADMIN("Admin"),
    USER("User");

    private final String displayName;

    UserRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getAuthority() {
        return "ROLE_" + name();
    }

    public static UserRole fromValue(String value) {
        if (value == null || value.isBlank()) {
            return USER;
        }

        for (UserRole role : values()) {
            if (role.name().equalsIgnoreCase(value) || role.displayName.equalsIgnoreCase(value)) {
                return role;
            }
        }

        throw new IllegalArgumentException("Unsupported role: " + value);
    }
}
