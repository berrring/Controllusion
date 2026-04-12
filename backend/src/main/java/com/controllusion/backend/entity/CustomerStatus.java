package com.controllusion.backend.entity;

public enum CustomerStatus {
    NEW("New"),
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    VIP("VIP");

    private final String displayName;

    CustomerStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CustomerStatus fromValue(String value) {
        if (value == null || value.isBlank()) {
            return NEW;
        }

        for (CustomerStatus status : values()) {
            if (status.name().equalsIgnoreCase(value) || status.displayName.equalsIgnoreCase(value)) {
                return status;
            }
        }

        throw new IllegalArgumentException("Unsupported customer status: " + value);
    }
}
