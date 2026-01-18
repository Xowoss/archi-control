package gestion_events.gestion_event.graphql.resolver;

import gestion_events.gestion_event.domain.entity.Event;
import gestion_events.gestion_event.graphql.dto.EventInput;
import gestion_events.gestion_event.service.EventService;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

@Controller
public class EventMutationResolver {

    private final EventService eventService;

    public EventMutationResolver(EventService eventService) {
        this.eventService = eventService;
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Event createEvent(@Argument EventInput input) {
        return eventService.createEvent(input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Event updateEvent(@Argument Long id, @Argument EventInput input) {
        return eventService.updateEvent(id, input);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteEvent(@Argument Long id) {
        return eventService.deleteEvent(id);
    }
}
