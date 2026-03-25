package com.sportsync.dto;

import jakarta.validation.constraints.*;

public class CreateEventRequest {

    @NotBlank
    private String sport;

    @NotBlank
    private String eventDate;

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