package org.learncorner.app.controller;

import org.learncorner.app.DTO.CourseDTO;
import org.learncorner.app.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping("/courses/{courseId}")
    public Mono<ResponseEntity<CourseDTO>> getCourseById(@PathVariable Long courseId) {
        return courseService.getCourseById(courseId)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/courses")
    public Mono<Page<CourseDTO>> listPageable(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return courseService.listPageable(pageable);
    }

    @GetMapping("/courses/search/byCategory")
    public Mono<Page<CourseDTO>> listByCategory(
            @RequestParam String category,
            @RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return courseService.listByCategory(category, pageable);
    }

    @GetMapping("/courses/search/byType")
    public Mono<ResponseEntity<Page<CourseDTO>>> listByType(@RequestParam String courseType,
                                             @RequestParam int page,
                                             @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Mono<Page<CourseDTO>> pageMono = courseService.listByType(courseType, pageable);
        return pageMono.map(coursePage -> {
            int numElements = coursePage.getNumberOfElements();
            if(numElements ==0) {
                return new ResponseEntity<>(coursePage, HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(coursePage, HttpStatus.OK);
        });
    }

    @GetMapping("/courses/search/byTitle")
    public Mono<Page<CourseDTO>> listByTitle(@RequestParam String title,
                                         @RequestParam int page,
                                         @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        return courseService.listByTitle(title, pageable);
    }
}
