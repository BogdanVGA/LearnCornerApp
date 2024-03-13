package org.learncorner.app.controller;

import org.learncorner.app.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/user/{userEmail}/courses")
    public Mono<ResponseEntity<?>> listCoursesByUser(@PathVariable String userEmail) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    Jwt jwt = (Jwt) authentication.getDetails();
                    String jwtEmail = jwt.getClaimAsString("sub");
                    if (jwtEmail == null || !jwtEmail.equals(userEmail)) {
                        return Mono.just(ResponseEntity.status(403).body("Access denied: Email mismatch."));
                    } else {
                        return historyService.userHistoryByEmail(userEmail)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.notFound().build());
                    }
                });
    }
}

/* https://dzone.com/articles/you-dont-need-hibernate-with-spring-webflux-and-r2 */
/* https://howtodoinjava.com/spring-webflux/spring-webflux-tutorial/ */
/* https://medium.com/cognizantsoftvision-guildhall/getting-started-with-reactive-spring-spring-webflux-3914cc62855e */