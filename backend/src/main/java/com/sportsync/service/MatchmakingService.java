package com.sportsync.service;

import com.sportsync.entity.Event;
import com.sportsync.entity.User;
import com.sportsync.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchmakingService {

    private final EventService eventService;
    private final UserRepository userRepository;

    public MatchmakingService(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    /**
     * "Player-Finding Mode" endpoint for organizers that queries the database 
     * for nearby users who match the event's criteria and haven't joined yet.
     */
    public List<User> findPlayersForEvent(Long eventId, double radiusInMeters) {
        // Fetch event details
        Event event = eventService.findById(eventId);

        // Extract coordinates, skill, and sport
        double lon = event.getLongitude();
        double lat = event.getLatitude();

        // Pass into the native query
        List<User> matchingUsers = userRepository.findMatchingUsers(
            event.getRequiredSkillLevel(),
            event.getSportType(),
            eventId
        );

        return matchingUsers.stream()
                .filter(u -> calculateDistance(lat, lon, u.getLatitude(), u.getLongitude()) <= radiusInMeters)
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; 
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                 + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                 * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; 
    }
}
