package org.learncorner.app.repository;

import org.learncorner.app.entity.History;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface HistoryRepository extends ReactiveCrudRepository<History, Long>, UserHistoryRepository {

}
