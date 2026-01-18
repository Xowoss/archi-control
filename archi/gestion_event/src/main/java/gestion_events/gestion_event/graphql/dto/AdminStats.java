package gestion_events.gestion_event.graphql.dto;

public record AdminStats(
        int eventsCount,
        int ticketsSold,
        double revenue
) {}
