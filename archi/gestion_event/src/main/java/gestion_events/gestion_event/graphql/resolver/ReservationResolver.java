package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.entity.Reservation;
import gestion_events.gestion_event.service.ReservationService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ReservationResolver {

    private final ReservationService reservationService;

    public ReservationResolver(ReservationService reservationService) {
        this.reservationService = reservationService;
    }


    @MutationMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Reservation createReservation(@Argument Long eventId,
                                         @Argument Integer quantity,
                                         Authentication authentication) {

        String email = authentication.getName(); // subject du JWT = email
        return reservationService.createReservation(eventId, quantity, email);
    }


    @QueryMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<Reservation> myReservations(Authentication authentication) {
        String email = authentication.getName();
        return reservationService.myReservations(email);
    }
    @QueryMapping
    public String whoami(Authentication auth) {
        return (auth == null) ? "NO_AUTH" : auth.getName();
    }

}
