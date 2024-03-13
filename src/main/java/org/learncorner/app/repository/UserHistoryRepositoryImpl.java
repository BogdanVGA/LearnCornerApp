package org.learncorner.app.repository;

import org.learncorner.app.DTO.UserHistoryDTO;
import org.learncorner.app.mapper.UserHistoryMapper;
import org.springframework.r2dbc.core.DatabaseClient;
import reactor.core.publisher.Flux;

public class UserHistoryRepositoryImpl implements UserHistoryRepository {

    private final DatabaseClient dbClient;
    private final UserHistoryMapper mapper;

    public UserHistoryRepositoryImpl(DatabaseClient dbClient, UserHistoryMapper mapper) {
        this.dbClient = dbClient;
        this.mapper = mapper;
    }

    @Override
    public Flux<UserHistoryDTO> findAllUserHistory(Long userId) {
        String query =
                "SELECT " +
                "course.title, course.course_type, course.image, history.start_date, history.end_date, history.status " +
                "FROM course LEFT JOIN history ON history.course_id = course.id " +
                "WHERE history.user_id = :userId";
        return dbClient.sql(query).bind("userId", userId).map(mapper::apply).all();
    }

    @Override
    public Flux<UserHistoryDTO> findAllUserHistoryByEmail(String userEmail) {
        String query =
                "SELECT " +
                "ROW_NUMBER() OVER (ORDER BY history.start_date DESC) AS row_id, " +
                "course.title, course.course_type, course.image, history.start_date, history.end_date, history.status " +
                "FROM course " +
                "LEFT JOIN history ON history.course_id = course.id " +
                "LEFT JOIN users ON history.user_id = users.id " +
                "WHERE users.email = :email";
        return dbClient.sql(query).bind("email", userEmail).map(mapper::apply).all();
    }
}
