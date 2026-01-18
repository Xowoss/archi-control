package gestion_events.gestion_event.repository;

import gestion_events.gestion_event.domain.entity.Reservation;
import gestion_events.gestion_event.domain.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {


    List<Reservation> findByUserEmailOrderByCreatedAtDesc(String email);


    @Query("""
        select coalesce(sum(r.quantity),0)
        from Reservation r
        where r.event.id = :eventId and r.status = :status
    """)
    Integer sumQuantityByEventAndStatus(Long eventId, ReservationStatus status);

    @Query("""
        select coalesce(sum(r.quantity),0)
        from Reservation r
        where r.status = :status
    """)
    Integer sumQuantityByStatus(ReservationStatus status);
}
