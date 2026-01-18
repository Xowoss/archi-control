package gestion_events.gestion_event.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import gestion_events.gestion_event.domain.enums.Role;

public record RegisterRequest(
        @NotBlank @Size(min = 2, message = "Le nom doit contenir au moins 2 caractères") String name,
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères") String password,
        Role role
) {}
