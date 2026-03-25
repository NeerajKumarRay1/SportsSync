package com.sportsync.service;

import com.sportsync.entity.Event;
import com.sportsync.entity.Review;
import com.sportsync.entity.User;
import com.sportsync.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserService userService;
    private final EventService eventService;

    public ReviewService(ReviewRepository reviewRepository, UserService userService, EventService eventService) {
        this.reviewRepository = reviewRepository;
        this.userService = userService;
        this.eventService = eventService;
    }

    /**
     * Submits a new review and immediately recalibrates the user's aggregate reputation score.
     */
    @Transactional
    public Review submitReview(Long reviewerId, Long revieweeId, Long eventId, Integer rating, String comment) {
        
        User reviewer = userService.findById(reviewerId);
        User reviewee = userService.findById(revieweeId);
        Event event = eventService.findById(eventId);

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setEvent(event);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        Review savedReview = reviewRepository.save(review);

        // Instantly recalculate the reviewee's new aggregated reputation score
        userService.updateReputationScore(revieweeId);

        return savedReview;
    }
}
