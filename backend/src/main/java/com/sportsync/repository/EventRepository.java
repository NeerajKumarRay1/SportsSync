package com.sportsync.repository;

import com.sportsync.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    /**
     * Haversine formula — finds events within `radiusKm` kilometres.
     * Only returns OPEN or FULL events (not CANCELLED or COMPLETED).
     *
     * 6371 = Earth's radius in km.
     */
    @Query(value = """
        SELECT * FROM events e
        WHERE e.status IN ('OPEN', 'FULL')
          AND (
            6371 * acos(
              cos(radians(:lat)) * cos(radians(e.latitude)) *
              cos(radians(e.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(e.latitude))
            )
          ) <= :radiusKm
        ORDER BY e.date_time ASC
        """, nativeQuery = true)
    List<Event> findNearby(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm
    );

    /**
     * Same as above but filtered by sport type.
     */
    @Query(value = """
        SELECT * FROM events e
        WHERE e.status IN ('OPEN', 'FULL')
          AND LOWER(e.sport_type) = LOWER(:sport)
          AND (
            6371 * acos(
              cos(radians(:lat)) * cos(radians(e.latitude)) *
              cos(radians(e.longitude) - radians(:lng)) +
              sin(radians(:lat)) * sin(radians(e.latitude))
            )
          ) <= :radiusKm
        ORDER BY e.date_time ASC
        """, nativeQuery = true)
    List<Event> findNearbyBySport(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radiusKm") double radiusKm,
            @Param("sport") String sport
    );

    /**
     * Events where a specific user is a participant (not organizer).
     */
    @Query(value = """
        SELECT e.* FROM events e
        JOIN event_participants ep ON ep.event_id = e.id
        WHERE ep.user_id = :userId
          AND e.status NOT IN ('CANCELLED', 'COMPLETED')
        ORDER BY e.date_time ASC
        """, nativeQuery = true)
    List<Event> findByParticipantId(@Param("userId") Long userId);

    /**
     * Events the user is organizing.
     */
    @Query("SELECT e FROM Event e WHERE e.organizer.id = :organizerId AND e.status NOT IN ('CANCELLED', 'COMPLETED') ORDER BY e.dateTime ASC")
    List<Event> findByOrganizerId(@Param("organizerId") Long organizerId);
}
