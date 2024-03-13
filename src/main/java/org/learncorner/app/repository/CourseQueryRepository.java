package org.learncorner.app.repository;

import org.learncorner.app.DTO.CourseDTO;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface CourseQueryRepository {

    Flux<CourseDTO> findAllCourses(Pageable pageable);

    Mono<Long> countAllCourses();

    Flux<CourseDTO> findAllCoursesByType(String courseType, Pageable pageable);

    Mono<Long> countAllCoursesByType(String courseType);

    Flux<CourseDTO> findAllCoursesByAuthor(Long authorId, Pageable pageable);

    Mono<Long> countAllCoursesByAuthor(Long authorId);

    Flux<CourseDTO> findAllCoursesByCategory(String category, Pageable pageable);

    Mono<Long> countAllCoursesByCategory(String category);

    Flux<CourseDTO> findAllCoursesByTitleContaining(String title, Pageable pageable);

    Mono<Long> countAllCoursesByTitleContaining(String title);

    Mono<CourseDTO> findCourseById(Long id);
}
