package org.learncorner.app.controller;

import org.learncorner.app.DTO.CourseRegisterDTO;
import org.learncorner.app.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class HistoryController {

    private final HistoryService historyService;

    @Autowired
    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping("/user/{username}/courses")
    public Mono<ResponseEntity<?>> listCoursesByUser(@PathVariable String username) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    Jwt jwt = (Jwt) authentication.getDetails();
                    String jwtUsername = jwt.getClaimAsString("sub");
                    if (jwtUsername == null || !jwtUsername.equals(username)) {
                        return Mono.just(ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body("Access denied: User mismatch."));
                    } else {
                        return historyService.userHistoryByUsername(username)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.notFound().build());
                    }
                });
    }

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
}

/* https://dzone.com/articles/you-dont-need-hibernate-with-spring-webflux-and-r2 */
/* https://howtodoinjava.com/spring-webflux/spring-webflux-tutorial/ */
/* https://medium.com/cognizantsoftvision-guildhall/getting-started-with-reactive-spring-spring-webflux-3914cc62855e */