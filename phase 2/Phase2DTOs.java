package com.sportsync.dto;

// ─────────────────────────────────────────────────────────────────────────────
// Split each of these into its own file in your project.
// Kept together here for readability.
// ─────────────────────────────────────────────────────────────────────────────

import jakarta.validation.constraints.*;

// ─── CreateEventRequest ───────────────────────────────────────────────────────
public class CreateEventRequest {

    @NotBlank
    private String sport;

    @NotBlank
    private String eventDate;   // ISO-8601 string, validated as @Future in entity

    @Min(2) @Max(100)
    private int maxPlayers;

    @NotBlank
    private String requiredSkill;

    @DecimalMin("-90.0") @DecimalMax("90.0")
    private double latitude;

    @DecimalMin("-180.0") @DecimalMax("180.0")
    private double longitude;

    @NotBlank @Size(max = 255)
    private String locationName;

    // Getters & setters
    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }
    public String getRequiredSkill() { return requiredSkill; }
    public void setRequiredSkill(String requiredSkill) { this.requiredSkill = requiredSkill; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
}

// ─── EventResponse ────────────────────────────────────────────────────────────
class EventResponse {
    private String eventId, sport, status, eventDate, locationName, requiredSkill, organizerId, organizerName;
    private double latitude, longitude;
    private int maxPlayers, currentPlayers;

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
    public int getMaxPlayers() { return maxPlayers; }
    public void setMaxPlayers(int maxPlayers) { this.maxPlayers = maxPlayers; }
    public int getCurrentPlayers() { return currentPlayers; }
    public void setCurrentPlayers(int currentPlayers) { this.currentPlayers = currentPlayers; }
    public String getRequiredSkill() { return requiredSkill; }
    public void setRequiredSkill(String requiredSkill) { this.requiredSkill = requiredSkill; }
    public String getOrganizerId() { return organizerId; }
    public void setOrganizerId(String organizerId) { this.organizerId = organizerId; }
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
}

// ─── UserProfileResponse ──────────────────────────────────────────────────────
class UserProfileResponse {
    private String userId, displayName, email, avatarUrl, bio, primarySport;
    private int skillLevel, gamesPlayed, gamesOrganized, reliabilityPct;
    private double reputationScore;
    private boolean verified;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getPrimarySport() { return primarySport; }
    public void setPrimarySport(String primarySport) { this.primarySport = primarySport; }
    public int getSkillLevel() { return skillLevel; }
    public void setSkillLevel(int skillLevel) { this.skillLevel = skillLevel; }
    public double getReputationScore() { return reputationScore; }
    public void setReputationScore(double reputationScore) { this.reputationScore = reputationScore; }
    public int getGamesPlayed() { return gamesPlayed; }
    public void setGamesPlayed(int gamesPlayed) { this.gamesPlayed = gamesPlayed; }
    public int getGamesOrganized() { return gamesOrganized; }
    public void setGamesOrganized(int gamesOrganized) { this.gamesOrganized = gamesOrganized; }
    public int getReliabilityPct() { return reliabilityPct; }
    public void setReliabilityPct(int reliabilityPct) { this.reliabilityPct = reliabilityPct; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}

// ─── ScheduleEventResponse ───────────────────────────────────────────────────
class ScheduleEventResponse {
    private String eventId, sport, eventDate, locationName, role;

    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

// ─── UpdateProfileRequest ─────────────────────────────────────────────────────
class UpdateProfileRequest {
    @Size(min = 2, max = 50)
    private String displayName;

    @Size(max = 300)
    private String bio;

    private String primarySport;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getPrimarySport() { return primarySport; }
    public void setPrimarySport(String primarySport) { this.primarySport = primarySport; }
}
