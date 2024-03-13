package org.learncorner.app.controller;

import org.learncorner.app.entity.Review;
import org.learncorner.app.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/reviews/search/byCourseId")
    public Mono<Page<Review>> listByCourseId(@RequestParam Long courseId,
                                             @RequestParam(name = "page", defaultValue = "0") int page,
                                             @RequestParam(name = "size", defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return reviewService.listByCourseId(courseId, pageable);
    }
}
