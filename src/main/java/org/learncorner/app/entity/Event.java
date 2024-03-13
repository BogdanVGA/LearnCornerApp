package org.learncorner.app.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Data
@Table(name = "events")
public class Event {

    @Id
    @Column("id")
    private Long id;

    @Column("course_id")
    private Long courseId;

    @Column("places")
    private int places;

    @Column("max_places")
    private int maxPlaces;

    @Column("start_date")
    private LocalDate startDate;

    @Column("end_date")
    private LocalDate endDate;
}
