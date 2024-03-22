import { useEffect, useState } from "react";
import CourseModel from "../../model/CourseModel";
import ReviewModel from "../../model/ReviewModel";
import { StarsReview } from "../Utils/StarsReview";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { LatestReviews } from "./LatestReviews";
import EventModel from "../../model/EventModel";
import { CourseEvents } from "./CourseEvents";
import { Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import UserModel from "../../model/UserModel";

export const CourseRegisterPage = () => {

    // Authentication state
    const { oktaAuth, authState } = useOktaAuth();

    // User state
    const [ user, setUser ] = useState<UserModel>();
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // Course State
    const [course, setCourse] = useState<CourseModel>();
    const [isLoading, setIsLoading] = useState(true);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Course Events State
    const [courseEvents, setCourseEvents] = useState<EventModel[]>([])
    const [isLoadingEvent, setIsLoadingEvent] = useState(true);

    const [httpError, setHttpError] = useState(null);
    const courseId = (window.location.pathname).split('/')[2];

    useEffect(() => {

        const fetchCourse = async () => {
            const baseUrl: string = `http://localhost:8080/api/courses/${courseId}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error('Error retrieving course...');
            }

            const responseJson = await response.json();

            const loadedCourse: CourseModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                category: responseJson.category,
                courseType: responseJson.courseType,
                image: responseJson.image,
            };

            setCourse(loadedCourse);
            setIsLoading(false);
        };
        fetchCourse().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [courseId]);

    useEffect(() => {

        const fetchCourseReviews = async () => {
            
            const reviewUrl: string = `http://localhost:8080/api/reviews/search/byCourseId?courseId=${courseId}`;

            const responseReviews = await fetch(reviewUrl);

            if (!responseReviews.ok) {
                throw new Error('Error retrieving course reviews...');
            }

            const responseJsonReviews = await responseReviews.json();

            const responseData = responseJsonReviews.content;

            const loadedReviews: ReviewModel[] = [];

            let weightedStarReviews: number = 0;

            for (const key in responseData) {
                loadedReviews.push({
                    id: responseData[key].id,
                    username: responseData[key].username,
                    courseId: responseData[key].courseId,
                    reviewText: responseData[key].reviewText,
                    rating: responseData[key].rating,
                    date: responseData[key].reviewDate,
                });
                weightedStarReviews = weightedStarReviews + responseData[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);
        };

        fetchCourseReviews().catch((error: any) => {
            setIsLoadingReview(false);
            setHttpError(error.message);
        })
    }, [courseId]);

    useEffect(() => {

        const fetchCourseEvents = async () => {

            const eventUrl: string = `http://localhost:8080/api/events/search/byCourseId?courseId=${courseId}`;

            const responseEvents = await fetch(eventUrl);

            if (!responseEvents.ok) {
                throw new Error('Error retrieving course events...');
            }

            const responseJsonEvents = await responseEvents.json();

            const responseData = responseJsonEvents.content;

            const loadedEvents: EventModel[] = [];

            for (const key in responseData) {
                loadedEvents.push({
                    id: responseData[key].id,
                    courseId: responseData[key].courseId,
                    places: responseData[key].places,
                    maxPlaces: responseData[key].maxPlaces,
                    startDate: responseData[key].startDate,
                    endDate: responseData[key].endDate,
                    authUser: user?.username
                });
            }

            setCourseEvents(loadedEvents);
            setIsLoadingEvent(false);
        };

        fetchCourseEvents().catch((error: any) => {
            setIsLoadingEvent(false);
            setHttpError(error.message);
        })
    }, [courseId, user]);

    useEffect(() => {

        const fetchUserData = async () => {

            if (authState && authState.isAuthenticated) {

                try {
                    const userInfo = await oktaAuth.getUser();
                    const baseUrl: string = `http://localhost:8080/api/user?username=${userInfo.preferred_username}`;
                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };

                    const response = await fetch(baseUrl, requestOptions);
                    if (!response.ok) {
                        throw new Error('Error retrieving user data...');
                    }

                    const userData = await response.json();
                    const loggedUser: UserModel = {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        userRole: userData.userRole
                    };
                    setUser(loggedUser);

                } catch (error: any) {
                    setHttpError(error.message);
                } finally {
                    setIsLoadingUser(false);
                }
            } else {
                setIsLoadingUser(false);
            }
        };
        fetchUserData();
    }, [authState, oktaAuth]);

    if (isLoading || isLoadingReview || isLoadingEvent || isLoadingUser) {
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

    console.log(user);

    return (
        <div>
            {/* desktop section */}
            <div className='container-fluid m-5 d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {course?.image ?
                            <img
                                src={`data:image/jpeg;base64,${course?.image}`}
                                width='350'
                                height='h-100'
                                alt='Course'
                            />
                            :
                            <img
                                src={require('./../../Images/CoursesImages/diesel_eng.jpg')}
                                width='350'
                                height='h-100'
                                alt='Course'
                            />
                        }
                    </div>
                    <div className='col-sm-8 col-md-8 container'>
                        <div className='ml-2'>
                            <h2>{course?.title}</h2>
                            <h5 className='text-dark'>{course?.author}</h5>
                            <p className='lead'>{course?.description}</p>
                            <StarsReview rating={totalStars} size={24}></StarsReview>
                        </div>
                    </div>

                </div>
                <hr/>
                {course?.courseType === 'F2F' ?
                    <div className='row'>
                        <CourseEvents events={courseEvents} mobile={false} />
                    </div>
                    :
                    <div className='row mt-5'>
                        <div className='col-sm-2 col-md-2'>
                            <h5>Online course: </h5>
                        </div>
                        <div className='col-sm-10 col-md-10'>
                            <div className='row'>
                                <div className='col'>
                                    <p className='lead'>
                                        Comfortable learning at a stress free pace.
                                    </p>
                                </div>
                                <div className='col-2'>
                                    {authState?.isAuthenticated ?
                                        <Link className='btn btn-md main-color text-white btn-outline-dark' to='#'>
                                            Register
                                        </Link>
                                        :
                                        <Link className='btn btn-md main-color text-white btn-outline-dark' to='/login'>
                                            Login To Register
                                        </Link>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                }
                <LatestReviews reviews={reviews} courseId={course?.id} mobile={false} />
            </div>

            {/* mobile section */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {course?.image ?
                        <img
                            src={`data:image/jpeg;base64,${course?.image}`}
                            width='350'
                            height='200'
                            alt='Course'
                        />
                        :
                        <img
                            src={require('./../../Images/CoursesImages/diesel_eng.jpg')}
                            width='226'
                            height='349'
                            alt='Course'
                        />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{course?.title}</h2>
                        <h5 className='text-dark'>{course?.author}</h5>
                        <p className='lead'>{course?.description}</p>
                        <StarsReview rating={totalStars} size={24}></StarsReview>
                    </div>
                </div>
                <hr />
                {course?.courseType === 'F2F' ?
                    <CourseEvents events={courseEvents} mobile={true} />
                    :
                    <div className='row mt-5'>
                        <div className='col-sm-2 col-md-2'>
                            <h5>Online course: </h5>
                        </div>
                        <div className='col-sm-10 col-md-10'>
                            <div className='row'>
                                <div className='col'>
                                    <p className='lead'>
                                        Comfortable learning at a stress free pace.
                                    </p>
                                </div>
                                <div className='col-2'>
                                    <Link className='btn btn-md main-color text-white btn-outline-dark' to='#'>
                                        Register
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                }
                <LatestReviews reviews={reviews} courseId={course?.id} mobile={true} />
            </div>
        </div>
    );
}
