package org.learncorner.app.DTO;

import lombok.Data;

@Data
public class CourseDTO {

    private Long id;
    private String title;
    private String author;
    private String description;
    private String category;
    private String courseType;
    private String image;
}
