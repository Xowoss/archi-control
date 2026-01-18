package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.entity.Payment;
import gestion_events.gestion_event.service.PaymentService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class PaymentResolver {

    private final PaymentService paymentService;

    public PaymentResolver(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @MutationMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Payment payReservation(@Argument Long reservationId,
                                  @Argument Boolean simulateSuccess,
                                  Authentication authentication) {
        String email = authentication.getName();
        boolean success = simulateSuccess != null && simulateSuccess;
        return paymentService.payReservation(reservationId, success, email);
    }
}
