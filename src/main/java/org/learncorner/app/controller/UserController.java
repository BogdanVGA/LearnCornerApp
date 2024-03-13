package org.learncorner.app.controller;

import org.learncorner.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    private ReactiveAuthenticationManager authenticationManager;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public Mono<ResponseEntity<?>> getUserByEmail(@RequestParam String email) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    // Retrieve the Jwt from the authentication details.
                    Jwt jwt = (Jwt) authentication.getDetails();
                    String jwtEmail = jwt.getClaimAsString("sub");
                    if (jwtEmail == null || !jwtEmail.equals(email)) {
                        return Mono.just(ResponseEntity.status(403).body("Access denied: Email mismatch."));
                    } else {
                        return userService.getUserByEmail(email)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.notFound().build());
                    }
                });
    }
}

/*
Emails do not match: It returns a Mono.just(ResponseEntity.status(403).body("Access denied: Email mismatch.")).
This is a Mono<ResponseEntity<?>> with the body type inferred as String due to the message, but it's compatible
with ResponseEntity<?> due to the wildcard generic.
Emails match and user is found: The method userService.getUserByEmail(email) is expected to return a Mono<User>.
This Mono is then mapped to a ResponseEntity.ok() containing the user, effectively making it a
Mono<ResponseEntity<User>>. This is compatible with Mono<ResponseEntity<?>> because User matches the wildcard ?.
Emails match but no user is found: It returns Mono.just(ResponseEntity.notFound().build()), which is a
Mono<ResponseEntity<?>>. The notFound().build() method creates a ResponseEntity with a 404 status, and since
there's no response body, it's implicitly a ResponseEntity<Void>, which still matches ResponseEntity<?>.
Therefore, regardless of the path taken, the method getUserByEmail returns a Mono<ResponseEntity<?>>.
To print email extracted from jwt token:
.map(jwt -> {
    String mail = jwt.getClaimAsString("sub");
    System.out.println(mail);
    return mail;
});
without instanceof: .filter(authentication -> Jwt.class.equals(authentication.getPrincipal().getClass()))
*/