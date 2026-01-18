package gestion_events.gestion_event.users.service;

import gestion_events.gestion_event.domain.entity.User;
import gestion_events.gestion_event.repository.UserRepository;
import gestion_events.gestion_event.users.dto.UpdateMeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByEmailOrThrow(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    @Transactional
    public User updateMe(String email, UpdateMeRequest request) {
        User user = getByEmailOrThrow(email);
        user.setName(request.name());
        return userRepository.save(user);
    }
}
