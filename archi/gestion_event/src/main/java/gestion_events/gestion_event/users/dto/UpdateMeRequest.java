package gestion_events.gestion_event.users.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateMeRequest(
        @NotBlank String name
) {}
