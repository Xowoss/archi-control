package gestion_events.gestion_event.repository;

import gestion_events.gestion_event.domain.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<Event, Long> {}

