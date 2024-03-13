package org.learncorner.app.service;

import org.learncorner.app.entity.Review;
import org.learncorner.app.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

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
}
