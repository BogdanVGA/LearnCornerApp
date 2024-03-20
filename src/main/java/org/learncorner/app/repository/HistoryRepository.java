package org.learncorner.app.repository;

import org.learncorner.app.entity.History;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

public interface HistoryRepository extends ReactiveCrudRepository<History, Long>, UserHistoryRepository {

    Mono<Boolean> existsByUserIdAndCourseId(Long userId, Long courseId);

    Mono<History> findByUserIdAndCourseId(Long userId, Long courseId);
}
