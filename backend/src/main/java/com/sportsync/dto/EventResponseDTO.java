package com.sportsync.dto;

import com.sportsync.entity.Event;
import com.sportsync.entity.EventStatus;
import com.sportsync.entity.SkillLevel;
import java.time.LocalDateTime;

public record EventResponseDTO(
    Long id,
    String organizerName,
    String sportType,
    double lat,
    double lon,
    LocalDateTime dateTime,
    int maxPlayerCount,
    SkillLevel requiredSkillLevel,
    EventStatus status
) {
    public static EventResponseDTO fromEntity(Event event) {
        return new EventResponseDTO(
            event.getId(),
            event.getOrganizer().getName(),
            event.getSportType(),
            event.getLatitude(),
            event.getLongitude(),
            event.getDateTime(),
            event.getMaxPlayerCount(),
            event.getRequiredSkillLevel(),
            event.getStatus()
        );
    }
}
