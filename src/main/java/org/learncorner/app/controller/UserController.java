package org.learncorner.app.controller;

import org.learncorner.app.DTO.UserUpdateDTO;
import org.learncorner.app.entity.User;
import org.learncorner.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("#username == authentication.details.claims['sub']")
    @GetMapping("/user")
    public Mono<ResponseEntity<User>> getUserByUsername(@RequestParam String username) {
        return userService.getUserByUsername(username)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PreAuthorize("#username == authentication.details.claims['sub']")
    @PutMapping("/user/update")
    public Mono<ResponseEntity<User>> updateUser(@RequestParam String username,
                                                 @RequestBody UserUpdateDTO userData) {
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
}
