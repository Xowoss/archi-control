package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.entity.Event;
import gestion_events.gestion_event.domain.entity.Payment;
import gestion_events.gestion_event.domain.entity.Reservation;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Controller
public class DateFieldResolver {

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @SchemaMapping(typeName = "Event", field = "dateTime")
    public String eventDateTime(Event event) {
        return format(event.getDateTime());
    }

    @SchemaMapping(typeName = "Reservation", field = "createdAt")
    public String reservationCreatedAt(Reservation reservation) {
        return format(reservation.getCreatedAt());
    }

    @SchemaMapping(typeName = "Payment", field = "createdAt")
    public String paymentCreatedAt(Payment payment) {
        return format(payment.getCreatedAt());
    }

    private String format(LocalDateTime dateTime) {
        return dateTime == null ? null : dateTime.format(ISO);
    }
}
