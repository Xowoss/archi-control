package gestion_events.gestion_event.graphql.dto;

import java.util.List;

public record EventInput(
        String title,
        String description,
        String dateTime,     
        String location,
        String organizer,
        List<String> participants,
        Integer ticketLimit,
        Double ticketPrice   
) {}
