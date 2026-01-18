package gestion_events.gestion_event.repository;

import gestion_events.gestion_event.domain.entity.Payment;
import gestion_events.gestion_event.domain.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    @Query("""
        select coalesce(sum(p.amount),0)
        from Payment p
        where p.status = :status
    """)
    BigDecimal sumAmountByStatus(PaymentStatus status);
}
