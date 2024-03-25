package org.learncorner.app.service;

import org.learncorner.app.DTO.AddReviewDTO;
import org.learncorner.app.DTO.ReviewResponse;
import org.learncorner.app.entity.Review;
import org.learncorner.app.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    public Mono<Page<Review>> listByCourseId(Long courseId, Pageable pageable) {
        return reviewRepo.findAllByCourseId(courseId, pageable).collectList().map(monoList -> {
            int count = monoList.size();
            return new PageImpl<>(monoList, pageable, count);
        });
    }

    @Transactional
    public Mono<ReviewResponse> addCourseReview(String username, AddReviewDTO request) {
        Long courseId = request.getCourseId();
        return reviewRepo.existsByUsernameAndCourseId(username, courseId)
                .flatMap(reviewExists -> {
                    if(reviewExists) {
                        return Mono.just(new ReviewResponse(true, null));
                    } else {
                        Review toAdd = new Review();
                        toAdd.setUsername(username);
                        toAdd.setCourseId(courseId);
                        toAdd.setReviewText(request.getReviewText());
                        toAdd.setRating(request.getCourseRating());
                        toAdd.setReviewDate(LocalDate.now());
                        return reviewRepo.save(toAdd)
                                .map(savedReview -> new ReviewResponse(false, toAdd));
                    }
                });
    }
}
