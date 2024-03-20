package org.learncorner.app.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.learncorner.app.entity.History;

@AllArgsConstructor
@Getter
public class EnrollmentResult {

    private boolean isEnrolled;
    private History enrollment;
}
