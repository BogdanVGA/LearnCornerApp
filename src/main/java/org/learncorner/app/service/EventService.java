package org.learncorner.app.service;

import org.learncorner.app.entity.Event;
import org.learncorner.app.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDate;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepo;

    public Mono<Page<Event>> listByCourseId(Long courseId, Pageable pageable) {
        return eventRepo.findAllByCourseId(courseId, pageable).collectList().map(monoList -> {
            LocalDate crtDate = LocalDate.now();
            monoList.removeIf(crtEvent -> crtDate.isAfter(crtEvent.getStartDate()));
            int count = monoList.size();
            return new PageImpl<>(monoList, pageable, count);
        });
    }
}
