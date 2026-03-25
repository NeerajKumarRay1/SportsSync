package com.sportsync.controller;

import com.sportsync.dto.ScheduleEventResponse;
import com.sportsync.dto.UpdateProfileRequest;
import com.sportsync.dto.UserProfileResponse;
import com.sportsync.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * GET /api/users/me/profile
     * Returns the full profile of the currently authenticated user.
     */
    @GetMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    /**
     * PATCH /api/users/me/profile
     * Partial update — only provided fields are changed.
     */
    @PatchMapping("/me/profile")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @AuthenticationPrincipal String userId,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    /**
     * GET /api/users/me/events
     * Returns all events the current user is playing in or organizing.
     */
    @GetMapping("/me/events")
    public ResponseEntity<List<ScheduleEventResponse>> getMyEvents(
            @AuthenticationPrincipal String userId
    ) {
        return ResponseEntity.ok(userService.getSchedule(userId));
    }
}
