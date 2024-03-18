package org.learncorner.app.DTO;

import lombok.Data;

@Data
public class UserUpdateDTO {

    private String firstName;
    private String lastName;
    private String username;
    private String email;
}
