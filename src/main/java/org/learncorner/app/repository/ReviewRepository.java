package org.learncorner.app.repository;

import org.learncorner.app.entity.Review;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ReviewRepository extends ReactiveCrudRepository<Review, Long> {

    Flux<Review> findAllByCourseId(Long courseId, Pageable pageable);

    Mono<Boolean> existsByUsernameAndCourseId(String username, Long courseId);
}
