package com.sportsync.controller;

import com.sportsync.service.RosterService;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rosters")
@Validated
public class RosterController {

    private final RosterService rosterService;

    public RosterController(RosterService rosterService) {
        this.rosterService = rosterService;
    }

    @PostMapping("/join")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> joinEvent(
            @RequestParam @NotNull(message = "Event ID is required") @Positive(message = "Event ID must be positive") Long eventId, 
            @RequestParam @NotNull(message = "User ID is required") @Positive(message = "User ID must be positive") Long userId) {
        rosterService.joinEvent(eventId, userId);
        return ResponseEntity.ok("Successfully joined the event.");
    }
}
