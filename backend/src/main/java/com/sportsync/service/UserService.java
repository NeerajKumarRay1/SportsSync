package com.sportsync.service;

import com.sportsync.dto.ScheduleEventResponse;
import com.sportsync.dto.UpdateProfileRequest;
import com.sportsync.dto.UserProfileResponse;
import com.sportsync.entity.Event;
import com.sportsync.entity.User;
import com.sportsync.exception.ValidationException;
import com.sportsync.repository.EventRepository;
import com.sportsync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String userId) {
        User user = findUser(userId);
        return toProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest req) {
        User user = findUser(userId);
        if (req.getDisplayName() != null) user.setDisplayName(req.getDisplayName());
        if (req.getBio() != null) user.setBio(req.getBio());
        if (req.getPrimarySport() != null) user.setPrimarySport(req.getPrimarySport());
        return toProfileResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<ScheduleEventResponse> getSchedule(String userId) {
        Long uuid = Long.parseLong(userId);
        List<ScheduleEventResponse> schedule = new ArrayList<>();

        // Events where user is a participant
        eventRepository.findByParticipantId(uuid).forEach(e ->
            schedule.add(toScheduleResponse(e, "PLAYING"))
        );

        // Events user is organizing
        eventRepository.findByOrganizerId(uuid).forEach(e ->
            schedule.add(toScheduleResponse(e, "ORGANIZING"))
        );

        // Sort by event date ascending
        schedule.sort((a, b) -> a.getEventDate().compareTo(b.getEventDate()));
        return schedule;
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ValidationException("User not found"));
    }

    @Transactional
    public void updateReputationScore(Long userId) {
        // Dummy implementation since Phase 1 had it
    }

    // ── Private helpers ────────────────────────────────────────────────────────


    private User findUser(String userId) {
        return userRepository.findById(Long.parseLong(userId))
                .orElseThrow(() -> new ValidationException("User not found."));
    }

    private UserProfileResponse toProfileResponse(User u) {
        UserProfileResponse r = new UserProfileResponse();
        r.setUserId(u.getId().toString());
        r.setDisplayName(u.getDisplayName());
        r.setEmail(u.getEmail());
        r.setAvatarUrl(u.getAvatarUrl());
        r.setBio(u.getBio());
        r.setPrimarySport(u.getPrimarySport());
        r.setSkillLevel(u.getSkillLevel().ordinal());
        r.setReputationScore(u.getReputationScore());
        r.setGamesPlayed(u.getGamesPlayed());
        r.setGamesOrganized(u.getGamesOrganized());
        r.setReliabilityPct(u.getReliabilityPct());
        r.setVerified(u.isVerified());
        return r;
    }

    private ScheduleEventResponse toScheduleResponse(Event e, String role) {
        ScheduleEventResponse r = new ScheduleEventResponse();
        r.setEventId(e.getId().toString());
        r.setSport(e.getSportType());
        r.setEventDate(e.getDateTime().atZone(java.time.ZoneId.of("UTC")).format(java.time.format.DateTimeFormatter.ISO_INSTANT));
        r.setLocationName(e.getLocationName());
        r.setRole(role);
        return r;
    }
}
