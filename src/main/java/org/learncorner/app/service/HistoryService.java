package org.learncorner.app.service;

import org.learncorner.app.DTO.CourseRegisterDTO;
import org.learncorner.app.DTO.UserHistoryDTO;
import org.learncorner.app.entity.Event;
import org.learncorner.app.entity.History;
import org.learncorner.app.entity.User;
import org.learncorner.app.DTO.EnrollResponse;
import org.learncorner.app.repository.EventRepository;
import org.learncorner.app.repository.HistoryRepository;
import org.learncorner.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class HistoryService {

    private final HistoryRepository historyRepo;
    private final UserRepository userRepo;
    private final EventRepository eventRepo;

    @Autowired
    public HistoryService(HistoryRepository historyRepo,
                          UserRepository userRepo,
                          EventRepository eventRepo) {
        this.historyRepo = historyRepo;
        this.userRepo = userRepo;
        this.eventRepo = eventRepo;
    }

    public Mono<List<UserHistoryDTO>> userHistoryByUsername(String username) {
        return historyRepo.findAllUserHistoryByUsername(username).collectList();
    }

    @Transactional
    public Mono<EnrollResponse> enrollUser(String username, CourseRegisterDTO request) {
        Mono<User> crtUserMono = userRepo.findByUsername(username);
        Mono<Event> crtEventMono = eventRepo.findById(request.getEventId());

        return Mono.zip(crtUserMono, crtEventMono)
                .flatMap(tuple -> {
                    User crtUser = tuple.getT1();
                    Event crtEvent = tuple.getT2();
                    return historyRepo.existsByUserIdAndCourseId(crtUser.getId(), request.getCourseId())
                            .flatMap(enrollmentExists -> {
                                if(enrollmentExists) {
                                    return Mono.just(new EnrollResponse(true, null));
                                } else {
                                    crtEvent.setPlaces(request.getPlaces());
                                    Mono<Event> updatedEventMono = eventRepo.save(crtEvent);

                                    History enroll = new History();
                                    enroll.setUserId(crtUser.getId());
                                    enroll.setCourseId(request.getCourseId());
                                    enroll.setStartDate(request.getStartDate());
                                    enroll.setEndDate(request.getEndDate());
                                    enroll.setStatus("registered");
                                    return updatedEventMono.then(historyRepo.save(enroll))
                                            .map(savedEnrollment -> new EnrollResponse(false, savedEnrollment));
                                }
                            });
                });
    }
}
