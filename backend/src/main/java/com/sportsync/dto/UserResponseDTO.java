package com.sportsync.dto;

import com.sportsync.entity.SkillLevel;
import com.sportsync.entity.User;

public record UserResponseDTO(
    Long id,
    String name,
    Double reputationScore,
    SkillLevel skillLevel
) {
    public static UserResponseDTO fromEntity(User user) {
        return new UserResponseDTO(
            user.getId(),
            user.getName(),
            user.getReputationScore(),
            user.getSkillLevel()
        );
    }
}
