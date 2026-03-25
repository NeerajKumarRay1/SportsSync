package com.sportsync.dto;

public class AuthResponse {

    private String token;
    private String userId;
    private String email;
    private String displayName;

    public AuthResponse(String token, String userId, String email, String displayName) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.displayName = displayName;
    }

    public String getToken() { return token; }
    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
}