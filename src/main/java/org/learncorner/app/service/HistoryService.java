package org.learncorner.app.service;

import org.learncorner.app.DTO.UserHistoryDTO;
import org.learncorner.app.repository.HistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class HistoryService {

    private final HistoryRepository historyRepo;

    @Autowired
    public HistoryService(HistoryRepository historyRepo) {
        this.historyRepo = historyRepo;
    }

    public Mono<List<UserHistoryDTO>> userHistoryByUsername(String username) {
        return historyRepo.findAllUserHistoryByUsername(username).collectList();
    }
}
