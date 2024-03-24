package org.learncorner.app.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserHistoryDTO {

    private Long rowId;
    private Long courseId;
    private String courseTitle;
    private String courseType;
    private String courseImage;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}
