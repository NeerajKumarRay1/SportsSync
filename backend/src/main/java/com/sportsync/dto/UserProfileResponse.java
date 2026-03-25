package com.sportsync.dto;

public class UserProfileResponse {
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