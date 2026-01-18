package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.enums.PaymentStatus;
import gestion_events.gestion_event.domain.enums.ReservationStatus;
import gestion_events.gestion_event.graphql.dto.AdminStats;
import gestion_events.gestion_event.repository.EventRepository;
import gestion_events.gestion_event.repository.PaymentRepository;
import gestion_events.gestion_event.repository.ReservationRepository;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.math.BigDecimal;

@Controller
public class AdminStatsResolver {

    private final EventRepository eventRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentRepository paymentRepository;

    public AdminStatsResolver(EventRepository eventRepository,
                              ReservationRepository reservationRepository,
                              PaymentRepository paymentRepository) {
        this.eventRepository = eventRepository;
        this.reservationRepository = reservationRepository;
        this.paymentRepository = paymentRepository;
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public AdminStats adminStats() {
        int eventsCount = (int) eventRepository.count();

        Integer ticketsSold = reservationRepository.sumQuantityByStatus(ReservationStatus.CONFIRMED);
        if (ticketsSold == null) ticketsSold = 0;

        BigDecimal revenue = paymentRepository.sumAmountByStatus(PaymentStatus.SUCCESS);
        double revenueValue = revenue == null ? 0.0 : revenue.doubleValue();

        return new AdminStats(eventsCount, ticketsSold, revenueValue);
    }
}
