package org.learncorner.app.controller;

import org.learncorner.app.DTO.CourseRegisterDTO;
import org.learncorner.app.DTO.OnlineCourseRegisterDTO;
import org.learncorner.app.DTO.UserHistoryDTO;
import org.learncorner.app.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class HistoryController {

    private final HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @PreAuthorize("#username == authentication.details.claims['sub']")
    @GetMapping("/user/{username}/courses")
    public Mono<ResponseEntity<List<UserHistoryDTO>>> listCoursesByUser(@PathVariable String username) {
        return historyService.userHistoryByUsername(username)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PreAuthorize("#username == authentication.details.claims['sub']")
    @PostMapping("/user/{username}/enroll")
    public Mono<ResponseEntity<?>> registerUser(@PathVariable String username,
                                                @RequestBody CourseRegisterDTO request) {
        return historyService.enrollUser(username, request)
                .flatMap(enrollmentResult -> {
                    if(enrollmentResult.isEnrolled()) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("User is already enrolled in the course"));
                    } else {
                        return Mono.just(ResponseEntity.status(HttpStatus.CREATED)
                                .body(enrollmentResult.getEnrollment()));
                    }
                }).defaultIfEmpty(ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to enroll user"));
    }

    @PreAuthorize("#username == authentication.details.claims['sub']")
    @PostMapping("/user/{username}/enrollOnline")
    public Mono<ResponseEntity<?>> registerUserOnline(@PathVariable String username,
                                                      @RequestBody OnlineCourseRegisterDTO request) {
        return historyService.enrollUserOnline(username, request)
                .flatMap(enrollResult -> {
                    if(enrollResult.isEnrolled()) {
                        return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT)
                                .body("User is already enrolled in this online course"));
                    } else {
                        return Mono.just(ResponseEntity.status(HttpStatus.CREATED)
                                .body(enrollResult.getEnrollment()));
                    }
                }).defaultIfEmpty(ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Failed to enroll user to online course"));
    }
}

/* https://dzone.com/articles/you-dont-need-hibernate-with-spring-webflux-and-r2 */
/* https://howtodoinjava.com/spring-webflux/spring-webflux-tutorial/ */
/* https://medium.com/cognizantsoftvision-guildhall/getting-started-with-reactive-spring-spring-webflux-3914cc62855e */