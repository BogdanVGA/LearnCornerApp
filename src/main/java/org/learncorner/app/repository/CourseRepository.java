package org.learncorner.app.repository;

import org.learncorner.app.entity.Course;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface CourseRepository extends ReactiveCrudRepository<Course, Long>, CourseQueryRepository {

}

/* https://docs.spring.io/spring-data/relational/reference/r2dbc/query-methods.html */
