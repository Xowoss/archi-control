package gestion_events.gestion_event.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name="events")
public class Event {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(length=2000)
    private String description;

    @Column(nullable=false)
    private LocalDateTime dateTime;

    @Column(nullable=false)
    private String location;

    @Column(nullable=false)
    private String organizer;

    @ElementCollection
    @CollectionTable(name="event_participants", joinColumns=@JoinColumn(name="event_id"))
    @Column(name="participant")
    private List<String> participants;

    @Column(nullable=false)
    private Integer ticketLimit;

    @Column(nullable=false, precision = 12, scale = 2)
    private BigDecimal ticketPrice;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public String getLocation() {
        return location;
    }

    public String getOrganizer() {
        return organizer;
    }

    public List<String> getParticipants() {
        return participants;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public Integer getTicketLimit() {
        return ticketLimit;
    }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public void setParticipants(List<String> participants) { this.participants = participants; }
    public void setTicketLimit(Integer ticketLimit) { this.ticketLimit = ticketLimit; }
    public void setDateTime(LocalDateTime dateTime) { this.dateTime = dateTime; }
    public void setTicketPrice(BigDecimal ticketPrice) { this.ticketPrice = ticketPrice; }


}
