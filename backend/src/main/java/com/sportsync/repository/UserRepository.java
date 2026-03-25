package com.sportsync.repository;

import com.sportsync.entity.User;
import com.sportsync.entity.SkillLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);

    @Query("""
        SELECT u FROM User u JOIN u.preferredSports sport
        WHERE u.skillLevel = :skillLevel
        AND sport = :sport
        AND u.id NOT IN (SELECT r.user.id FROM Roster r WHERE r.event.id = :eventId)
    """)
    List<User> findMatchingUsers(
        @Param("skillLevel") SkillLevel skillLevel,
        @Param("sport") String sport,
        @Param("eventId") Long eventId
    );
}
