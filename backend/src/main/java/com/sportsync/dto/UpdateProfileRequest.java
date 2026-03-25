package com.sportsync.dto;

import jakarta.validation.constraints.*;

public class UpdateProfileRequest {
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