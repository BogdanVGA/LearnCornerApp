package org.learncorner.app.controller;

import org.learncorner.app.DTO.UserUpdateDTO;
import org.learncorner.app.service.UserService;
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
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public Mono<ResponseEntity<?>> getUserByUsername(@RequestParam String username) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    // Retrieve the Jwt from the authentication details.
                    Jwt jwt = (Jwt) authentication.getDetails();
                    String jwtUsername = jwt.getClaimAsString("sub");
                    if (jwtUsername == null || !jwtUsername.equals(username)) {
                        return Mono.just(ResponseEntity.status(403).body("Access denied: User mismatch."));
                    } else {
                        return userService.getUserByUsername(username)
                                .map(ResponseEntity::ok)
                                .defaultIfEmpty(ResponseEntity.notFound().build());
                    }
                });
    }

    @PutMapping("/user/update")
    public Mono<ResponseEntity<?>> updateUser(@RequestParam String username,
                                              @RequestBody UserUpdateDTO userData) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .flatMap(authentication -> {
                    Jwt jwt = (Jwt) authentication.getDetails();
                    String jwtUsername = jwt.getClaimAsString("sub");
                    if (jwtUsername == null || !jwtUsername.equals(username)) {
                        return Mono.just(ResponseEntity.status(403).body("Access denied: User mismatch"));
                    } else {
                        return userService.getUserByUsername(username)
                                .flatMap(user -> {
                                    user.setFirstName(userData.getFirstName());
                                    user.setLastName(userData.getLastName());
                                    user.setEmail(userData.getEmail());
                                    return userService.updateUser(user)
                                            .thenReturn(ResponseEntity.status(202).body(user));
                                })
                                .defaultIfEmpty(ResponseEntity.notFound().build());
                    }
                });
    }
}

/*
    Usernames do not match: It returns a Mono.just(ResponseEntity.status(403).body("Access denied: User mismatch.")).
    This is a Mono<ResponseEntity<?>> with the body type inferred as String due to the message, but it's compatible
    with ResponseEntity<?> due to the wildcard generic.
    Usernames match and user is found: The method userService.getUserByUsername(username) is expected to return a Mono<User>.
    This Mono is then mapped to a ResponseEntity.ok() containing the user, effectively making it a
    Mono<ResponseEntity<User>>. This is compatible with Mono<ResponseEntity<?>> because User matches the wildcard ?.
    Usernames match but no user is found: It returns Mono.just(ResponseEntity.notFound().build()), which is a
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

/*
    The method returns Mono<ResponseEntity<?>> to allow different types of bodies (either a user object or a string
    message) depending on the situation. ResponseEntity status codes and bodies are set manually. This offers
    flexibility for defining specific HTTP responses directly within the method.
    defaultIfEmpty after the flatMap handles the case where no user is found for the given email, returning a
    404 Not Found status.
    The thenReturn is used after the updateUser(user) call to return the updated user wrapped in a 200 OK
    ResponseEntity. This avoids nesting Mono within another Mono which was happening due to the
    map(updated -> Mono.just(...)) pattern used previously.
 */