package gestion_events.gestion_event.security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test/secure")
    public String secure() {
        return "OK - JWT valide ✅";
    }
}
