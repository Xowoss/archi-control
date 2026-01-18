package gestion_events.gestion_event.users.controller;

import gestion_events.gestion_event.domain.entity.User;
import gestion_events.gestion_event.users.dto.UpdateMeRequest;
import gestion_events.gestion_event.users.dto.UserMeResponse;
import gestion_events.gestion_event.users.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserMeResponse me(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getByEmailOrThrow(email);

        return new UserMeResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    @PutMapping("/me")
    public UserMeResponse updateMe(@Valid @RequestBody UpdateMeRequest request,
                                   Authentication authentication) {
        String email = authentication.getName();
        User updated = userService.updateMe(email, request);

        return new UserMeResponse(
                updated.getId(),
                updated.getName(),
                updated.getEmail(),
                updated.getRole()
        );
    }
}
