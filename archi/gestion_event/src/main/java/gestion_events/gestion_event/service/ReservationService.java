package gestion_events.gestion_event.service;

import gestion_events.gestion_event.domain.entity.Event;
import gestion_events.gestion_event.domain.entity.Reservation;
import gestion_events.gestion_event.domain.entity.User;
import gestion_events.gestion_event.domain.enums.ReservationStatus;
import gestion_events.gestion_event.repository.EventRepository;
import gestion_events.gestion_event.repository.ReservationRepository;
import gestion_events.gestion_event.repository.UserRepository;
import gestion_events.gestion_event.notification.NotificationService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final NotificationService notificationService;

    public ReservationService(ReservationRepository reservationRepository,
                              UserRepository userRepository,
                              EventRepository eventRepository,
                              NotificationService notificationService) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.notificationService = notificationService;
    }

    public Reservation createReservation(Long eventId, int quantity, String userEmail) {

        if (quantity <= 0) {
            throw new RuntimeException("La quantité doit être > 0");
        }
        if (quantity > 4) {
            throw new RuntimeException("Vous ne pouvez pas réserver plus de 4 tickets.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + userEmail));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event introuvable (id=" + eventId + ")"));

        if (event.getDateTime() != null && event.getDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Impossible de réserver sur un évènement déjà passé.");
        }

        Integer sold = reservationRepository.sumQuantityByEventAndStatus(eventId, ReservationStatus.CONFIRMED);
        if (sold == null) sold = 0;

        int remaining = event.getTicketLimit() - sold;
        if (quantity > remaining) {
            throw new RuntimeException("Tickets insuffisants. Restants = " + remaining);
        }

        // totalAmount = quantity * ticketPrice
        // ticketPrice peut être BigDecimal (recommandé)
        BigDecimal total = event.getTicketPrice().multiply(BigDecimal.valueOf(quantity));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setEvent(event);
        reservation.setQuantity(quantity);
        reservation.setTotalAmount(total);
        reservation.setStatus(ReservationStatus.PENDING_PAYMENT);
        reservation.setCreatedAt(LocalDateTime.now());

        Reservation saved = reservationRepository.save(reservation);

        notificationService.sendEmail(
                user.getEmail(),
                "Reservation en attente de paiement",
                "Votre reservation pour l'evenement '" + event.getTitle() + "' a ete enregistree. " +
                        "Quantite: " + quantity + ", Total: " + total + ". Merci de proceder au paiement."
        );

        return saved;
    }

    public List<Reservation> myReservations(String userEmail) {
        return reservationRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }
}
