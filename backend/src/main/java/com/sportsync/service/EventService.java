package com.sportsync.service;

import com.sportsync.dto.CreateEventRequest;
import com.sportsync.dto.EventResponse;
import com.sportsync.entity.Event;
import com.sportsync.entity.User;
import com.sportsync.exception.ValidationException;
import com.sportsync.repository.EventRepository;
import com.sportsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    /**
     * Finds events within `radiusKm` of the given coordinates using the
     * Haversine formula in a native query on the repository.
     * Optionally filters by sport type.
     */
    @Transactional(readOnly = true)
    public List<EventResponse> findNearby(double lat, double lng, double radiusKm, String sport) {
        List<Event> events = (sport == null || sport.isBlank())
                ? eventRepository.findNearby(lat, lng, radiusKm)
                : eventRepository.findNearbyBySport(lat, lng, radiusKm, sport);

        return events.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EventResponse findById(String id) {
        Event event = eventRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new ValidationException("Event not found."));
        return toResponse(event);
    }

    @Transactional(readOnly = true)
    public Event findById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new ValidationException("Event not found"));
    }

    @Transactional
    public EventResponse create(CreateEventRequest req, String organizerId) {
        User organizer = userRepository.findById(Long.parseLong(organizerId))
                .orElseThrow(() -> new ValidationException("User not found."));

        Event event = new Event();
        event.setSportType(req.getSport());
        event.setDateTime(java.time.LocalDateTime.ofInstant(Instant.parse(req.getEventDate()), java.time.ZoneId.of("UTC")));
        event.setMaxPlayerCount(req.getMaxPlayers());
        event.setRequiredSkillLevel(com.sportsync.entity.SkillLevel.valueOf(req.getRequiredSkill().toUpperCase()));
        event.setLatitude(req.getLatitude());
        event.setLongitude(req.getLongitude());
        event.setLocationName(req.getLocationName());
        event.setOrganizer(organizer);
        event.setStatus(com.sportsync.entity.EventStatus.OPEN);

        Event saved = eventRepository.save(event);
        return toResponse(saved);
    }

    @Transactional
    public void joinEvent(String eventId, String userId) {
        Event event = eventRepository.findById(Long.parseLong(eventId))
                .orElseThrow(() -> new ValidationException("Event not found."));

        if (!"OPEN".equals(event.getStatus().name())) {
            throw new ValidationException("This event is no longer open.");
        }
        if (event.getParticipants().size() >= event.getMaxPlayerCount()) {
            throw new ValidationException("Event is full.");
        }

        User user = userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new ValidationException("User not found."));

        event.getParticipants().add(user);
        if (event.getParticipants().size() >= event.getMaxPlayerCount()) {
            event.setStatus(com.sportsync.entity.EventStatus.FULL);
        }
        eventRepository.save(event);
    }

    @Transactional
    public void leaveEvent(String eventId, String userId) {
        Event event = eventRepository.findById(Long.parseLong(eventId))
                .orElseThrow(() -> new ValidationException("Event not found."));

        event.getParticipants().removeIf(u -> u.getId().toString().equals(userId));
        if ("FULL".equals(event.getStatus().name())) {
            event.setStatus(com.sportsync.entity.EventStatus.OPEN);
        }
        eventRepository.save(event);
    }

    // ── Mapper ────────────────────────────────────────────────────────────────
    private EventResponse toResponse(Event e) {
        EventResponse r = new EventResponse();
        r.setEventId(e.getId().toString());
        r.setSport(e.getSportType());
        r.setStatus(e.getStatus().name());
        r.setEventDate(e.getDateTime().atZone(java.time.ZoneId.of("UTC")).format(java.time.format.DateTimeFormatter.ISO_INSTANT));
        r.setLocationName(e.getLocationName());
        r.setLatitude(e.getLatitude());
        r.setLongitude(e.getLongitude());
        r.setMaxPlayers(e.getMaxPlayerCount());
        r.setCurrentPlayers(e.getParticipants() != null ? e.getParticipants().size() : 0);
        r.setRequiredSkill(e.getRequiredSkillLevel().name());
        r.setOrganizerId(e.getOrganizer().getId().toString());
        r.setOrganizerName(e.getOrganizer().getDisplayName());
        return r;
    }
}
