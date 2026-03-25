package com.sportsync.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // Will store hashed JWT password

    @ElementCollection
    @CollectionTable(name = "user_preferred_sports", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "sport")
    private List<String> preferredSports;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillLevel skillLevel;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private Double reputationScore = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(nullable = false)
    private Integer gamesPlayed = 0;

    @Column(nullable = false)
    private Integer gamesOrganized = 0;

    @Column(nullable = false)
    private Integer reliabilityPct = 100;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column
    private String primarySport;

    @Column
    private String avatarUrl;

    @Column(nullable = false)
    private boolean verified = false;

    @ManyToMany
    @JoinTable(
        name = "event_participants",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private List<Event> joinedEvents;

    // Helper methods for AuthService compatibility
    public String getPasswordHash() { return this.password; }
    public void setPasswordHash(String passwordHash) { this.password = passwordHash; }
    
    public String getDisplayName() { return this.name; }
    public void setDisplayName(String displayName) { this.name = displayName; }
}
