package com.sportsync.controller;

import com.sportsync.dto.CreateEventRequest;
import com.sportsync.dto.EventResponse;
import com.sportsync.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    /**
     * GET /api/events?lat=&lng=&radius=&sport=
     * Returns events within radius km of the given coordinates.
     * The authenticated user's ID comes from the JWT via @AuthenticationPrincipal.
     */
    @GetMapping
    public ResponseEntity<List<EventResponse>> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radius,
            @RequestParam(required = false) String sport
    ) {
        List<EventResponse> events = eventService.findNearby(lat, lng, radius, sport);
        return ResponseEntity.ok(events);
    }

    /**
     * GET /api/events/:id
     */
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getById(@PathVariable String id) {
        return ResponseEntity.ok(eventService.findById(id));
    }

    /**
     * POST /api/events
     */
    @PostMapping
    public ResponseEntity<EventResponse> create(
            @Valid @RequestBody CreateEventRequest request,
            @AuthenticationPrincipal String organizerId
    ) {
        EventResponse created = eventService.create(request, organizerId);
        return ResponseEntity.status(201).body(created);
    }

    /**
     * POST /api/events/:id/join
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<Void> join(
            @PathVariable String id,
            @AuthenticationPrincipal String userId
    ) {
        eventService.joinEvent(id, userId);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /api/events/:id/leave
     */
    @DeleteMapping("/{id}/leave")
    public ResponseEntity<Void> leave(
            @PathVariable String id,
            @AuthenticationPrincipal String userId
    ) {
        eventService.leaveEvent(id, userId);
        return ResponseEntity.noContent().build();
    }
}
