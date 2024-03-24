import React from 'react'
import CourseModel from "../../../model/CourseModel"
import { Link } from 'react-router-dom';

export const SearchCourse: React.FC<{ course: CourseModel }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='card-body'>
                <div className='row gx-5'>
                    <div className='col-md-2'>
                        {/* div for desktop version */}
                        <div className='d-none d-lg-block'>
                            {props.course.image ?
                                <img src={`data:image/jpeg;base64,${props.course.image}`}
                                    width='180'
                                    height='120'
                                    alt='Course'
                                />
                                :
                                <img src={require('../../../Images/CoursesImages/diesel_eng.jpg')}
                                    width='180'
                                    height='120'
                                    alt='Course'
                                />
                            }
                        </div>
                        {/* div for the mobile version */}
                        <div className='d-lg-none d-flex align-items-center justify-content-center'>
                            {props.course.image ?
                                <img src={`data:image/jpeg;base64,${props.course.image}`}
                                    style={{ width: '100%', height: 'auto' }}
                                    alt='Course'
                                />
                                :
                                <img src={require('../../../Images/CoursesImages/diesel_eng.jpg')}
                                    width='180'
                                    height='120'
                                    alt='Course'
                                />
                            }
                        </div>
                    </div>
                    <div className='col-md-10'>
                        <h4 className='card-title'>
                            {props.course.title}
                        </h4>
                        <h5>
                            {props.course.author}
                        </h5>
                        <p className='card-text mb-3'>
                            {props.course.description}
                        </p>
                    </div>
                </div>
                <div className='row mt-2'>
                    <div className='col-md-2 d-flex align-items-top justify-content-begin'>
                        {props.course.courseType === 'online' ? 'Online course' : 'Onsite course'}
                    </div>
                    <div className='col-md-10 d-flex align-items-center justify-content-end'>
                        <Link className='btn btn-md main-color text-white btn-outline-dark' to={`/register/${props.course.id}`}>
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
