package org.learncorner.app.mapper;

import io.r2dbc.spi.Row;
import org.learncorner.app.DTO.UserHistoryDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.function.BiFunction;

@Component
public class UserHistoryMapper implements BiFunction<Row, Object, UserHistoryDTO> {

    @Override
    public UserHistoryDTO apply(Row row, Object o) {
        Long rowId = row.get("row_id", Long.class);
        String courseTitle = row.get("title", String.class);
        String courseType = row.get("course_type", String.class);
        String courseImage = row.get("image", String.class);
        LocalDate startDate = row.get("start_date", LocalDate.class);
        LocalDate endDate = row.get("end_date", LocalDate.class);
        String status = row.get("status", String.class);
        UserHistoryDTO userHistory = new UserHistoryDTO();
        userHistory.setRowId(rowId);
        userHistory.setCourseTitle(courseTitle);
        userHistory.setCourseType(courseType);
        userHistory.setCourseImage(courseImage);
        userHistory.setStartDate(startDate);
        userHistory.setEndDate(endDate);
        userHistory.setStatus(status);
        return userHistory;
    }
}
