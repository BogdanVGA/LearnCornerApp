package org.learncorner.app.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.r2dbc.config.EnableR2dbcAuditing;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Data
@Table(name = "review")
@EnableR2dbcAuditing
public class Review {

    @Id
    @Column("id")
    private Long id;

    @Column("username")
    private String username;

    @Column("course_id")
    private long courseId;

    @Column("review_text")
    private String reviewText;

    @Column("rating")
    private double rating;

    @Column("review_date")
    @CreatedDate
    private LocalDate reviewDate;
}

/* https://medium.com/swlh/data-auditing-with-spring-data-r2dbc-5d428fc94688 */