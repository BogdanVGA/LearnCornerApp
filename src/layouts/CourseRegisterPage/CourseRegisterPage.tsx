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
import { Modal } from "../Utils/Modal";

export const CourseRegisterPage = () => {

    // Authentication state
    const { oktaAuth, authState } = useOktaAuth();

    // User state
    const [user, setUser] = useState<UserModel>();
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

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const courseId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchCourse = async () => {
            try {
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

            } catch (error: any) {
                setModalMessage(error.message);
                setShowModal(true);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    useEffect(() => {
        const fetchCourseReviews = async () => {
            try {
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

            } catch (error: any) {
                setModalMessage(error.message);
                setShowModal(true);
            } finally {
                setIsLoadingReview(false);
            }
        };
        fetchCourseReviews();
    }, [courseId]);

    useEffect(() => {
        const fetchCourseEvents = async () => {
            try {
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

            } catch(error: any) {
                setModalMessage(error.message);
                setShowModal(true);
            } finally {
                setIsLoadingEvent(false);
            }    
        };
        fetchCourseEvents();
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
                    setModalMessage(error.message);
                    setShowModal(true);
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

    console.log(user);

    const onRegister = async () => {

        const data = {
            username: user?.username,
            courseId: course?.id,
        }

        const registerUrl = `http://localhost:8080/api/user/${user?.username}/enrollOnline`;

        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        console.log(requestOptions);
        console.log(registerUrl);

        try {
            const response = await fetch(registerUrl, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to enroll user: ${errorText}`);
            }

            const updatedUserData = await response.json();
            console.log(updatedUserData);
            setModalMessage('Enrollment successfull!');
            setShowModal(true);

        } catch (error: any) {
            setModalMessage(error.message);
            setShowModal(true);
        }
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <Modal showModal={showModal} modalMessage={modalMessage} onClose={onCloseModal} />
            {/* desktop section */}
            <div className='container-fluid p-5 d-none d-lg-block'>
                <div className='row'>
                    <div className='col-2'>
                        {course?.image ?
                            <img
                                src={`data:image/jpeg;base64,${course?.image}`}
                                style={{ width: '100%', height: 'auto' }}
                                alt='Course'
                            />
                            :
                            <img
                                src={require('./../../Images/CoursesImages/diesel_eng.jpg')}
                                style={{ width: '100%', height: 'auto' }}
                                alt='Course'
                            />
                        }
                    </div>
                    <div className='col-9'>
                        <h2>{course?.title}</h2>
                        <h5 className='text-dark'>{course?.author}</h5>
                        <p className='lead text-wrap'>{course?.description}</p>
                        <StarsReview rating={totalStars} size={24}></StarsReview>
                    </div>
                </div>
                <hr />
                {course?.courseType === 'F2F' ?
                    <div className='row'>
                        <CourseEvents events={courseEvents} mobile={false} />
                    </div>
                    :
                    <div className='row mt-5'>
                        <div className='col-2'>
                            <h5>Online course: </h5>
                        </div>
                        <div className='col-sm-10 col-md-10'>
                            <div className='row'>
                                <div className='col-sm-10 col-md-10'>
                                    <p className='lead'>
                                        Comfortable learning at a stress free pace.
                                    </p>
                                </div>
                                <div className='col-sm-2 col-md-2'>
                                    {authState?.isAuthenticated ?
                                        <button className='btn btn-md main-color text-white btn-outline-dark' onClick={onRegister}>
                                            Register
                                        </button>
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
            <div className='container mt-5 d-lg-none'>
                <div className='d-flex justify-content-center align-items-center'>
                    {course?.image ?
                        <img
                            src={`data:image/jpeg;base64,${course?.image}`}
                            style={{ width: '100%', height: 'auto' }}
                            alt='Course'
                        />
                        :
                        <img
                            src={require('./../../Images/CoursesImages/diesel_eng.jpg')}
                            style={{ width: '100%', height: 'auto' }}
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
                                <div className='col-sm-10 col-md-10'>
                                    <p className='lead'>
                                        Comfortable learning at a stress free pace.
                                    </p>
                                </div>
                                <div className='col-sm-2 col-md-2'>
                                    {authState?.isAuthenticated ?
                                        <button className='btn btn-md main-color text-white btn-outline-dark' onClick={onRegister}>
                                            Register
                                        </button>
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
                <LatestReviews reviews={reviews} courseId={course?.id} mobile={true} />
            </div>
        </div>
    );
}
