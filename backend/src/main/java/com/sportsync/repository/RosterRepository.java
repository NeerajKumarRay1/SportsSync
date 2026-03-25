package com.sportsync.repository;

import com.sportsync.entity.Roster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RosterRepository extends JpaRepository<Roster, Long> {
    List<Roster> findByEventId(Long eventId);
    
    List<Roster> findByUserId(Long userId);
    
    Optional<Roster> findByEventIdAndUserId(Long eventId, Long userId);
    
    long countByEventId(Long eventId);
}
