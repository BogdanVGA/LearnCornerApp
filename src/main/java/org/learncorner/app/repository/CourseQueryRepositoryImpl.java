package org.learncorner.app.repository;

import org.learncorner.app.DTO.CourseDTO;
import org.learncorner.app.mapper.CourseMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.r2dbc.core.DatabaseClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public class CourseQueryRepositoryImpl implements CourseQueryRepository {

    private final DatabaseClient dbClient;
    private final CourseMapper mapper;

    public CourseQueryRepositoryImpl(DatabaseClient dbClient, CourseMapper mapper) {
        this.dbClient = dbClient;
        this.mapper = mapper;
    }

    @Override
    public Flux<CourseDTO> findAllCourses(Pageable pageable) {
        String query = "SELECT course.id, course.title, course.description, " +
                "course.category, course.course_type, course.image, users.first_name, users.last_name " +
                "FROM course LEFT JOIN users ON course.author_id = users.id " +
                "LIMIT :limit OFFSET :offset";
        return dbClient.sql(query)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(mapper::apply).all();
    }

    @Override
    public Mono<Long> countAllCourses() {
        String query = "SELECT COUNT (*) FROM course";
        return dbClient.sql(query).map(row -> row.get(0, Long.class)).one();
    }

    @Override
    public Flux<CourseDTO> findAllCoursesByType(String courseType, Pageable pageable) {
        String query = "SELECT course.id, course.title, course.description, " +
                "course.category, course.course_type, course.image, users.first_name, users.last_name " +
                "FROM course LEFT JOIN users ON course.author_id = users.id " +
                "WHERE course.course_type = :courseType " +
                "LIMIT :limit OFFSET :offset";
        return dbClient.sql(query)
                .bind("courseType", courseType)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(mapper::apply).all();
    }

    @Override
    public Mono<Long> countAllCoursesByType(String courseType) {
        String query = "SELECT COUNT (*) FROM course WHERE course.course_type = :courseType";
        return dbClient.sql(query).bind("courseType", courseType).map(row -> row.get(0, Long.class)).one();
    }

    @Override
    public Flux<CourseDTO> findAllCoursesByAuthor(Long authorId, Pageable pageable) {
        String query = "SELECT course.id, course.title, course.description, " +
                "course.category, course.course_type, course.image, users.first_name, users.last_name " +
                "FROM course LEFT JOIN users ON course.author_id = users.id " +
                "WHERE course.author_id = :authorId " +
                "LIMIT :limit OFFSET :offset";
        return dbClient.sql(query)
                .bind("authorId", authorId)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(mapper::apply).all();
    }

    @Override
    public Mono<Long> countAllCoursesByAuthor(Long authorId) {
        String query = "SELECT COUNT (*) FROM course WHERE course.author_id = :authorId";
        return dbClient.sql(query).bind("authorId", authorId).map(row -> row.get(0, Long.class)).one();
    }

    @Override
    public Flux<CourseDTO> findAllCoursesByCategory(String category, Pageable pageable) {
        String query = "SELECT course.id, course.title, course.description, " +
                "course.category, course.course_type, course.image, users.first_name, users.last_name " +
                "FROM course LEFT JOIN users ON course.author_id = users.id " +
                "WHERE course.category = :category " +
                "LIMIT :limit OFFSET :offset";
        return dbClient.sql(query)
                .bind("category", category)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(mapper::apply).all();
    }

    @Override
    public Mono<Long> countAllCoursesByCategory(String category) {
        String query = "SELECT COUNT (*) FROM course WHERE course.category = :category";
        return dbClient.sql(query).bind("category", category).map(row -> row.get(0, Long.class)).one();
    }

    @Override
    public Flux<CourseDTO> findAllCoursesByTitleContaining(String title, Pageable pageable) {
        String query = "SELECT course.id, course.title, course.description, " +
                "course.category, course.course_type, course.image, users.first_name, users.last_name " +
                "FROM course LEFT JOIN users ON course.author_id = users.id " +
                "WHERE course.title LIKE :titlePattern " +
                "LIMIT :limit OFFSET :offset";
        return dbClient.sql(query)
                .bind("titlePattern", "%" + title + "%")
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(mapper::apply).all();
    }

    @Override
    public Mono<Long> countAllCoursesByTitleContaining(String title) {
        String query = "SELECT COUNT (*) FROM course WHERE course.title LIKE :titlePattern";
        return dbClient.sql(query)
                .bind("titlePattern", "%" + title + "%")
                .map(row -> row.get(0, Long.class)).one();
    }

    @Override
    public Mono<CourseDTO> findCourseById(Long id) {
        String query = "SELECT course.id, course.title, course.description, " +
                "course.category, course.course_type, course.image, users.first_name, users.last_name " +
                "FROM course LEFT JOIN users ON course.author_id = users.id " +
                "WHERE course.id = :id";
        return dbClient.sql(query).bind("id", id).map(mapper::apply).one();
    }
}
