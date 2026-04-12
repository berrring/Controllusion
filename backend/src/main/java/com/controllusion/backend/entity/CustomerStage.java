package com.controllusion.backend.entity;

public enum CustomerStage {
    LEAD("Lead"),
    QUALIFIED("Qualified"),
    PROPOSAL("Proposal"),
    NEGOTIATION("Negotiation"),
    WON("Won"),
    LOST("Lost");

    private final String displayName;

    CustomerStage(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CustomerStage fromValue(String value) {
        if (value == null || value.isBlank()) {
            return LEAD;
        }

        for (CustomerStage stage : values()) {
            if (stage.name().equalsIgnoreCase(value) || stage.displayName.equalsIgnoreCase(value)) {
                return stage;
            }
        }

        throw new IllegalArgumentException("Unsupported customer stage: " + value);
    }
}
