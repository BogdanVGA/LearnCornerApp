package org.learncorner.app.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CourseRegisterDTO {

    private String username;
    private Long courseId;
    private LocalDate startDate;
    private LocalDate endDate;
}
