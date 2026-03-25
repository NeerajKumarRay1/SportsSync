package com.sportsync.controller;

import com.sportsync.dto.ReviewRequestDTO;
import com.sportsync.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Void> submitReview(@Valid @RequestBody ReviewRequestDTO request) {
        reviewService.submitReview(
                request.reviewerId(),
                request.revieweeId(),
                request.eventId(),
                request.rating(),
                request.comment()
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
