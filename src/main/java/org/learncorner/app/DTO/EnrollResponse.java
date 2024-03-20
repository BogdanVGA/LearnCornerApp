package org.learncorner.app.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.learncorner.app.entity.History;

@AllArgsConstructor
@Getter
public class EnrollResponse {

    private boolean isEnrolled;
    private History enrollment;
}
