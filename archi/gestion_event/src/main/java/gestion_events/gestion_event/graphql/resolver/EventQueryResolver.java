package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.entity.Event;
import gestion_events.gestion_event.service.EventService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class EventQueryResolver {

    private final EventService eventService;

    public EventQueryResolver(EventService eventService) {
        this.eventService = eventService;
    }

    // Correspond à: events: [Event!]!
    @QueryMapping
    public List<Event> events() {
        return eventService.findAll();
    }

    // Correspond à: eventById(id: ID!): Event
    @QueryMapping
    public Event eventById(@Argument Long id) {
        return eventService.findByIdOrNull(id);
    }


    // Correspond à: availableTickets(eventId: ID!): Int!
    @QueryMapping
    public Integer availableTickets(@Argument Long eventId) {
        return eventService.availableTickets(eventId);
    }
}
