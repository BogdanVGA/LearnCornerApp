package org.learncorner.app.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Data
@Table(name = "course")
public class Course {

    @Id
    private Long id;

    @Column("title")
    private String title;

    @Column("author_id")
    private Long authorId;

    @Column("description")
    private String description;

    @Column("category")
    private String category;

    @Column("course_type")
    private String courseType;

    @Column("image")
    private String image;
}
