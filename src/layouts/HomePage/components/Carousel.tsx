import { ReturnCourse } from "./ReturnCourse";
import { useEffect, useState } from "react";
import CourseModel from "../../../model/CourseModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";

export const Carousel = () => {

    const [courses, setCourses] = useState<CourseModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const baseUrl: string = "http://localhost:8080/api/courses";

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Error retrieving courses...')
            }

            const responseJson = await response.json();
            const responseData = responseJson.content;
            const loadedCourses: CourseModel[] = [];

            for (const key in responseData) {
                loadedCourses.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    category: responseData[key].category,
                    courseType: responseData[key].courseType,
                    image: responseData[key].image,
                });
            }
            setCourses(loadedCourses);
            setIsLoading(false);
        };
        fetchCourses().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div className='container-fluid mt-5 mb-5'>
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                {/* Desktop */}
                <div className='carousel-inner'>
                    <div className='carousel-item active'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {courses.slice(0, 3).map(course => (<ReturnCourse course={course} key={course.id} />))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {courses.slice(3, 6).map(course => (<ReturnCourse course={course} key={course.id} />))}
                        </div>
                    </div>
                    <div className='carousel-item'>
                        <div className='row d-flex justify-content-center align-items-center'>
                            {courses.slice(6, 9).map(course => (<ReturnCourse course={course} key={course.id} />))}
                        </div>
                    </div>
                    <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>
            </div>

            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                <div className='row d-flex justify-content-center align-items-center'>
                    <ReturnCourse course={courses[0]} key={courses[0].id} />
                </div>
            </div>

        </div>
    );
}
