package gestion_events.gestion_event.service;

import gestion_events.gestion_event.domain.entity.Payment;
import gestion_events.gestion_event.domain.entity.Reservation;
import gestion_events.gestion_event.domain.enums.PaymentStatus;
import gestion_events.gestion_event.domain.enums.ReservationStatus;
import gestion_events.gestion_event.notification.NotificationService;
import gestion_events.gestion_event.repository.PaymentRepository;
import gestion_events.gestion_event.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;

    public PaymentService(PaymentRepository paymentRepository,
                          ReservationRepository reservationRepository,
                          NotificationService notificationService) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
        this.notificationService = notificationService;
    }

    public Payment payReservation(Long reservationId, boolean simulateSuccess, String userEmail) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation introuvable (id=" + reservationId + ")"));

        if (reservation.getUser() == null || reservation.getUser().getEmail() == null ||
                !reservation.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Acces refuse sur cette reservation");
        }

        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            throw new RuntimeException("Reservation deja payee/confirmee.");
        }
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new RuntimeException("Reservation annulee : paiement impossible.");
        }

        PaymentStatus paymentStatus = simulateSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setAmount(reservation.getTotalAmount());
        payment.setStatus(paymentStatus);
        payment.setCreatedAt(LocalDateTime.now());

        if (paymentStatus == PaymentStatus.SUCCESS) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        } else {
            reservation.setStatus(ReservationStatus.CANCELLED);
        }

        reservationRepository.save(reservation);
        Payment saved = paymentRepository.save(payment);

        String clientName = reservation.getUser() != null ? reservation.getUser().getName() : "Client";
        String eventTitle = reservation.getEvent() != null ? reservation.getEvent().getTitle() : "evenement";
        String eventDate = reservation.getEvent() != null && reservation.getEvent().getDateTime() != null
                ? reservation.getEvent().getDateTime().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                : "date inconnue";
        String amount = String.valueOf(reservation.getTotalAmount());

        if (paymentStatus == PaymentStatus.SUCCESS) {
            notificationService.sendEmail(
                    userEmail,
                    "Paiement confirme",
                    "Bonjour " + clientName + ",\n\n" +
                            "Votre paiement est confirme pour l'evenement : " + eventTitle + "\n" +
                            "Date : " + eventDate + "\n" +
                            "Montant total : " + amount + "\n\n" +
                            "Merci pour votre achat."
            );
        } else {
            notificationService.sendEmail(
                    userEmail,
                    "Paiement echoue",
                    "Bonjour " + clientName + ",\n\n" +
                            "Votre paiement a echoue pour l'evenement : " + eventTitle + "\n" +
                            "Date : " + eventDate + "\n" +
                            "Montant total : " + amount + "\n\n" +
                            "Merci de reessayer."
            );
        }

        return saved;
    }
}
