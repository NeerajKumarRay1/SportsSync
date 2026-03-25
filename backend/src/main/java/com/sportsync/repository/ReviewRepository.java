package com.sportsync.repository;

import com.sportsync.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByRevieweeId(Long revieweeId);
    
    List<Review> findByEventId(Long eventId);
    
    /**
     * Calculates the average reputation score based on past reviews.
     * Triggered in the post-game loop.
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Double calculateAverageReputationScore(@Param("revieweeId") Long revieweeId);
}
