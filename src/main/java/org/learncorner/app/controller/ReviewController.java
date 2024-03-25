package org.learncorner.app.controller;

import org.learncorner.app.DTO.AddReviewDTO;
import org.learncorner.app.entity.Review;
import org.learncorner.app.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/reviews/search/byCourseId")
    public Mono<Page<Review>> listByCourseId(@RequestParam Long courseId,
                                             @RequestParam(name = "page", defaultValue = "0") int page,
                                             @RequestParam(name = "size", defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewService.listByCourseId(courseId, pageable);
    }

    @PostMapping("/user/{username}/addReview")
    public Mono<ResponseEntity<?>> addCourseReview(@PathVariable String username,
                                                   @RequestBody AddReviewDTO request) {
        return reviewService.addCourseReview(username, request)
                .flatMap(reviewResponse -> {
                    if(reviewResponse.isAlreadyReviewed()) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("You have already reviewed this course"));
                    } else {
                        return Mono.just(ResponseEntity.status(HttpStatus.CREATED)
                                .body(reviewResponse.getReview()));
                    }
                }).defaultIfEmpty(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add review"));
    }
}
