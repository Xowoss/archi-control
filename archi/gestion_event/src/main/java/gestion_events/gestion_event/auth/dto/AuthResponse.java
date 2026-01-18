package gestion_events.gestion_event.auth.dto;

public record AuthResponse(
        String token,
        String tokenType
) {}
