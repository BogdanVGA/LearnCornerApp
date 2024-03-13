package org.learncorner.app.mapper;

import io.r2dbc.spi.Row;
import org.learncorner.app.DTO.CourseDTO;
import org.springframework.stereotype.Component;

import java.util.function.BiFunction;

@Component
public class CourseMapper implements BiFunction<Row, Object, CourseDTO> {

    @Override
    public CourseDTO apply(Row row, Object o) {
        Long id = row.get("id", Long.class);
        String title = row.get("title", String.class);
        String authorFirstName = row.get("first_name", String.class);
        String authorLastName = row.get("last_name", String.class);
        String author =  authorFirstName + " " + authorLastName;
        String description = row.get("description", String.class);
        String category = row.get("category", String.class);
        String courseType = row.get("course_type", String.class);
        String image = row.get("image", String.class);
        CourseDTO courseDTO = new CourseDTO();
        courseDTO.setId(id);
        courseDTO.setTitle(title);
        courseDTO.setAuthor(author);
        courseDTO.setDescription(description);
        courseDTO.setCategory(category);
        courseDTO.setCourseType(courseType);
        courseDTO.setImage(image);
        return courseDTO;
    }
}
