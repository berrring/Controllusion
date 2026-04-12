package com.controllusion.backend.dto.customer;

import java.time.Instant;
import java.util.UUID;

public record CustomerNoteEntryResponse(
        UUID id,
        String author,
        String body,
        Instant date
) {
}
