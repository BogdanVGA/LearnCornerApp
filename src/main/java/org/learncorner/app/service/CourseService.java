package org.learncorner.app.service;

import org.learncorner.app.DTO.CourseDTO;
import org.learncorner.app.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepo;

    @Autowired
    public CourseService(CourseRepository courseRepo) {
        this.courseRepo = courseRepo;
    }

    public Mono<CourseDTO> getCourseById(Long courseId) {
        return courseRepo.findCourseById(courseId);
    }

    public Mono<Page<CourseDTO>> listPageable(Pageable pageable) {
        Mono<List<CourseDTO>> coursesMono = courseRepo.findAllCourses(pageable).collectList();
        Mono<Long> countMono = courseRepo.countAllCourses();
        return Mono.zip(coursesMono, countMono)
                .map(tuple -> {
                    List<CourseDTO> courses = tuple.getT1();
                    Long count = tuple.getT2();
                    return new PageImpl<>(courses, pageable, count);
                });
    }

    public Mono<Page<CourseDTO>> listByCategory(String category, Pageable pageable) {
        Mono<List<CourseDTO>> byCatMono = courseRepo.findAllCoursesByCategory(category, pageable).collectList();
        Mono<Long> countMono = courseRepo.countAllCoursesByCategory(category);
        return Mono.zip(byCatMono, countMono)
                .map(tuple -> {
                    List<CourseDTO> byCatList = tuple.getT1();
                    Long count = tuple.getT2();
                    return new PageImpl<>(byCatList, pageable, count);
                });
    }

    public Mono<Page<CourseDTO>> listByType(String courseType, Pageable pageable) {
        Mono<List<CourseDTO>> byTypeMono = courseRepo.findAllCoursesByType(courseType, pageable).collectList();
        Mono<Long> countMono = courseRepo.countAllCoursesByType(courseType);
        return Mono.zip(byTypeMono, countMono)
                .map(tuple -> {
                    List<CourseDTO> byTypeList = tuple.getT1();
                    Long byTypeCount = tuple.getT2();
                    return new PageImpl<>(byTypeList, pageable, byTypeCount);
                });
    }

    public Mono<Page<CourseDTO>> listByTitle(String title, Pageable pageable) {
        Mono<List<CourseDTO>> byTitleMono = courseRepo.findAllCoursesByTitleContaining(title, pageable).collectList();
        Mono<Long> countMono = courseRepo.countAllCoursesByTitleContaining(title);
        return Mono.zip(byTitleMono, countMono)
                .map(tuple -> {
                    List<CourseDTO> byTitleList = tuple.getT1();
                    Long byTitleCount = tuple.getT2();
                    return new PageImpl<>(byTitleList, pageable, byTitleCount);
                });
    }

    /* The method public Mono<Page<Course>> listByType(String courseType, Pageable pageable) is responsible for
        retrieving a paginated list of 'Course' objects from the repository, filtered by course type.
        The item emitted by the Mono<List<Course>> object returned by the .collectList() is transformed by applying
        a synchronous function to it via the .map method. The function is implemented with a lambda method which
        overrides the apply method inside the Interface Function<T,R>. The function gets the size of the list and
        uses it to construct a PageImpl object, which is a Spring Data class used to represent paginated data.

        https://docs.oracle.com/javase/8/docs/api/java/util/function/Function.html?is-external=true
        https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Mono.html
        https://www.youtube.com/watch?v=mlM5qKPS15k -> Pagination with Spring Webflux
     */

    /* The method public Mono<Page<Course>> findAllBy(Pageable pageable) is responsible for retrieving a paginated
     * list of 'Course' objects from the repository.
     * 1) repository.findAllBy(pageable): This part of the code queries the data repository (repository)
     * to retrieve a list of 'Course' objects based on the provided pageable parameter.
     * 2) .collectList(): This part of the code collects all the retrieved 'Course' objects into a Mono<List<Course>>.
     * The result is a Mono that emits a single list of 'Course' objects.
     * 3) .zipWith(repository.count()): In this step, the code combines the previously obtained Mono<List<Course>>
     * (from collectList) with another Mono<Long>, which represents the count of all 'Course' objects in the repository.
     * The zipWith operator is used to combine the two Mono instances into a new Mono<Tuple2<List<Course>, Long>>.
     * This tuple contains both the list of 'Course' objects and the total count.
     * 4) .map(objects -> new PageImpl<>(objects.getT1(), pageable, objects.getT2())): Finally, the code maps the
     * Tuple2 containing the list of 'Course' objects and the count into a Mono<Page<Course>>.
     * It constructs a PageImpl object, which is a Spring Data class used to represent paginated data.
     * The PageImpl is initialized with the list of 'Course' objects (objects.getT1()), the provided pageable,
     * and the total count (objects.getT2()). This resulting Mono emits a Page object representing the paginated results.
     */
}
