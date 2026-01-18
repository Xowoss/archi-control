package gestion_events.gestion_event.auth.service;

import gestion_events.gestion_event.auth.dto.AuthResponse;
import gestion_events.gestion_event.auth.dto.LoginRequest;
import gestion_events.gestion_event.auth.dto.RegisterRequest;
import gestion_events.gestion_event.domain.entity.User;
import gestion_events.gestion_event.domain.enums.Role;
import gestion_events.gestion_event.repository.UserRepository;
import gestion_events.gestion_event.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email deja utilise");
        }

        Role role = (req.role() != null) ? req.role() : Role.USER;

        User user = User.builder()
                .name(req.name())
                .email(req.email())
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(role)
                .build();

        userRepository.save(user);

        // Pas d'auto-login : pas de token renvoye ici
        return new AuthResponse(null, null);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect"));

        if (!passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse refresh(String bearerToken) {
        String token = jwtService.extractTokenValue(bearerToken);
        if (!jwtService.isTokenValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invalide ou expire");
        }
        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur introuvable : " + email));

        String newToken = jwtService.generateToken(user);
        return new AuthResponse(newToken, "Bearer");
    }
}
