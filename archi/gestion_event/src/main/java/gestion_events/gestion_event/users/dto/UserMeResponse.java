package gestion_events.gestion_event.users.dto;

import gestion_events.gestion_event.domain.enums.Role;

public record UserMeResponse(
        Long id,
        String name,
        String email,
        Role role
) {}
