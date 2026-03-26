package com.sportsync.service;

import com.sportsync.entity.Event;
import com.sportsync.entity.EventStatus;
import com.sportsync.entity.Roster;
import com.sportsync.entity.User;
import com.sportsync.exception.EventFullException;
import com.sportsync.exception.UserAlreadyJoinedException;
import com.sportsync.repository.EventRepository;
import com.sportsync.repository.RosterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RosterService {

    private final RosterRepository rosterRepository;
    private final EventService eventService;
    private final UserService userService;
    private final EventRepository eventRepository;

    public RosterService(RosterRepository rosterRepository, EventService eventService, 
                         UserService userService, EventRepository eventRepository) {
        this.rosterRepository = rosterRepository;
        this.eventService = eventService;
        this.userService = userService;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Roster joinEvent(Long eventId, Long userId) {
        // 1. Check if the event exists
        Event event = eventService.findById(eventId);

        // 2. Check if the event status is OPEN
        if (event.getStatus() != EventStatus.OPEN) {
            throw new EventFullException("Cannot join. Event status is " + event.getStatus());
        }

        // 3. Check if the user is already in the roster
        if (rosterRepository.findByEventIdAndUserId(eventId, userId).isPresent()) {
            throw new UserAlreadyJoinedException("User ID " + userId + " is already in the roster for Event ID " + eventId);
        }

        // 4. Check if adding this user exceeds maxPlayerCount
        long currentPlayers = rosterRepository.countByEventId(eventId);
        if (currentPlayers >= event.getMaxPlayerCount()) {
            throw new EventFullException("Event has reached its maximum player count of " + event.getMaxPlayerCount());
        }

        // Create and save roster entry
        User user = userService.findById(userId);
        
        Roster roster = new Roster();
        roster.setEvent(event);
        roster.setUser(user);
        roster.setJoinedAt(LocalDateTime.now());
        
        Roster savedRoster = rosterRepository.save(roster);

        // 5. If roster reaches max capacity after joining, update Event status to FULL
        if (currentPlayers + 1 >= event.getMaxPlayerCount()) {
            event.setStatus(EventStatus.FULL);
            eventRepository.save(event);
        }

        return savedRoster;
    }
}
