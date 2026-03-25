package com.sportsync.dto;

public class ScheduleEventResponse {
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