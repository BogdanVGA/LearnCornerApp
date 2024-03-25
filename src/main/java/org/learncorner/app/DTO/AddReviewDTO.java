package org.learncorner.app.DTO;

import lombok.Data;

@Data
public class AddReviewDTO {

    private String username;
    private Long courseId;
    private String reviewText;
    private Double courseRating;
}
