package gestion_events.gestion_event.service;

import gestion_events.gestion_event.domain.entity.Event;
import gestion_events.gestion_event.domain.enums.ReservationStatus;
import gestion_events.gestion_event.graphql.dto.EventInput;
import gestion_events.gestion_event.repository.EventRepository;
import gestion_events.gestion_event.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final ReservationRepository reservationRepository;

    public EventService(EventRepository eventRepository,
                        ReservationRepository reservationRepository) {
        this.eventRepository = eventRepository;
        this.reservationRepository = reservationRepository;
    }

    public List<Event> findAll() {
        return eventRepository.findAll();
    }

    public Event findByIdOrNull(Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    public int availableTickets(Long eventId) {
        Event event = findByIdOrNull(eventId);
        if (event == null) {
            throw new RuntimeException("Event introuvable (id=" + eventId + ")");
        }

        Integer soldConfirmed = reservationRepository
                .sumQuantityByEventAndStatus(eventId, ReservationStatus.CONFIRMED);

        if (soldConfirmed == null) soldConfirmed = 0;

        int remaining = event.getTicketLimit() - soldConfirmed;
        return Math.max(0, remaining);
    }


    public Event createEvent(EventInput input) {
        validate(input);
        Event e = new Event();
        applyInput(e, input);
        return eventRepository.save(e);
    }


    public Event updateEvent(Long id, EventInput input) {
        validate(input);
        Event e = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event introuvable (id=" + id + ")"));
        applyInput(e, input);
        return eventRepository.save(e);
    }


    public boolean deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) return false;
        eventRepository.deleteById(id);
        return true;
    }


    private void applyInput(Event e, EventInput input) {
        e.setTitle(input.title());
        e.setDescription(input.description());
        e.setLocation(input.location());
        e.setOrganizer(input.organizer());
        e.setParticipants(input.participants() == null ? List.of() : input.participants());
        e.setTicketLimit(input.ticketLimit());
        e.setDateTime(LocalDateTime.parse(input.dateTime()));
        e.setTicketPrice(BigDecimal.valueOf(input.ticketPrice()));
    }

    // Règles métier minimales pour un évènement
    private void validate(EventInput input) {
        if (input.title() == null || input.title().isBlank()) {
            throw new RuntimeException("Le titre est requis");
        }
        if (input.location() == null || input.location().isBlank()) {
            throw new RuntimeException("Le lieu est requis");
        }
        if (input.organizer() == null || input.organizer().isBlank()) {
            throw new RuntimeException("L'organisateur est requis");
        }
        if (input.ticketLimit() == null || input.ticketLimit() <= 0) {
            throw new RuntimeException("Le nombre de tickets doit être > 0");
        }
        if (input.ticketPrice() == null || input.ticketPrice() <= 0) {
            throw new RuntimeException("Le prix du ticket doit être > 0");
        }

        LocalDateTime date;
        try {
            date = LocalDateTime.parse(input.dateTime());
        } catch (Exception ex) {
            throw new RuntimeException("dateTime doit être au format ISO-8601 (ex: 2025-12-29T18:00:00)");
        }
        if (date.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("La date de l'évènement doit être dans le futur");
        }
    }
}
