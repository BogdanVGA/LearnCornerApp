package org.learncorner.app.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.learncorner.app.entity.Review;

@AllArgsConstructor
@Getter
public class ReviewResponse {

    private boolean alreadyReviewed;
    private Review review;
}
