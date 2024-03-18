package org.learncorner.app.repository;

import org.learncorner.app.DTO.UserHistoryDTO;
import reactor.core.publisher.Flux;

public interface UserHistoryRepository {

    Flux<UserHistoryDTO> findAllUserHistory(Long userId);

    Flux<UserHistoryDTO> findAllUserHistoryByUsername(String username);
}
