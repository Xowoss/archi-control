package gestion_events.gestion_event.auth.controller;

import gestion_events.gestion_event.auth.dto.AuthResponse;
import gestion_events.gestion_event.auth.dto.LoginRequest;
import gestion_events.gestion_event.auth.dto.RegisterRequest;
import gestion_events.gestion_event.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@RequestHeader("Authorization") String authorization) {
        return authService.refresh(authorization);
    }
}
