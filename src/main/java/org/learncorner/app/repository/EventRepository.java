package org.learncorner.app.repository;

import org.learncorner.app.entity.Event;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Flux;

public interface EventRepository extends ReactiveCrudRepository<Event, Long> {

    Flux<Event> findAllByCourseId(Long courseId, Pageable pageable);
}
