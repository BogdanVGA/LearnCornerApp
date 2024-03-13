package org.learncorner.app.service;

import org.learncorner.app.entity.User;
import org.learncorner.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class UserService {

    private final UserRepository userRepo;

    @Autowired
    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public Mono<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
}
