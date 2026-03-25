package com.sportsync.dto;

public record AuthResponseDTO(
    String token,
    Long userId,
    String name
) {}
