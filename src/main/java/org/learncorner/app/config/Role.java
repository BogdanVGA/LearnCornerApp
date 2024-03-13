package org.learncorner.app.config;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Role {

    user("user"),
    author("author"),
    admin("admin");

    private final String role;
}
