package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.entity.Event;
import gestion_events.gestion_event.service.EventService;
import org.springframework.graphql.data.method.annotation.SchemaMapping;
import org.springframework.stereotype.Controller;

@Controller
public class EventFieldResolver {

    private final EventService eventService;

    public EventFieldResolver(EventService eventService) {
        this.eventService = eventService;
    }

    @SchemaMapping(typeName = "Event", field = "availableTickets")
    public int availableTickets(Event event) {
        if (event == null || event.getId() == null) {
            return 0;
        }
        return eventService.availableTickets(event.getId());
    }
}
