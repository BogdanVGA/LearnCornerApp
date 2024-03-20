package org.learncorner.app.service;

import org.learncorner.app.DTO.CourseRegisterDTO;
import org.learncorner.app.DTO.UserHistoryDTO;
import org.learncorner.app.entity.History;
import org.learncorner.app.entity.User;
import org.learncorner.app.error.EnrollmentResult;
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

    @Autowired
    public HistoryService(HistoryRepository historyRepo, UserRepository userRepo) {
        this.historyRepo = historyRepo;
        this.userRepo = userRepo;
    }

    public Mono<List<UserHistoryDTO>> userHistoryByUsername(String username) {
        return historyRepo.findAllUserHistoryByUsername(username).collectList();
    }

    @Transactional
    public Mono<EnrollmentResult> enrollUser(String username, CourseRegisterDTO request) {
        Mono<User> crtUserMono = userRepo.findByUsername(username);
        return crtUserMono
                .flatMap(crtUser -> historyRepo.existsByUserIdAndCourseId(crtUser.getId(), request.getCourseId())
                .flatMap(enrollmentExists -> {
                    if(enrollmentExists) {
                        return Mono.just(new EnrollmentResult(true, null));
                    } else {
                        Long userId = crtUser.getId();
                        History enroll = new History();
                        enroll.setUserId(userId);
                        enroll.setCourseId(request.getCourseId());
                        enroll.setStartDate(request.getStartDate());
                        enroll.setEndDate(request.getEndDate());
                        enroll.setStatus("registered");
                        return historyRepo.save(enroll)
                                .map(savedEnrollment -> new EnrollmentResult(false, savedEnrollment));
                    }
                }));
    }
}
