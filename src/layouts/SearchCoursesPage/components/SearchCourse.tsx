import React from 'react'
import CourseModel from "../../../model/CourseModel"
import { Link } from 'react-router-dom';

export const SearchCourse: React.FC<{ course: CourseModel }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>

                    {/* div for desktop version */}
                    <div className='d-none d-lg-block'>
                        {props.course.image ?
                            <img src={`data:image/jpeg;base64,${props.course.image}`}
                                width='180'
                                height='h-100'
                                alt='Course'
                            />
                            :
                            <img src={require('../../../Images/CoursesImages/diesel_eng.jpg')}
                                width='180'
                                height='h-100'
                                alt='Course'
                            />
                        }
                    </div>

                    {/* div for the mobile version */}
                    <div className='d-lg-none d-flex justify-content-center 
                        align-items-center'>
                        {props.course.image ?
                            <img src={`data:image/jpeg;base64,${props.course.image}`}
                                width='180'
                                height='100'
                                alt='Course'
                            />
                            :
                            <img src={require('../../../Images/CoursesImages/diesel_eng.jpg')}
                                width='180'
                                height='100'
                                alt='Course'
                            />
                        }                        
                    </div>
                    <div className='mt-4'>{props.course.courseType === 'online' ? 'Online course' : 'Onsite course'}</div>
                </div>
                
                <div className='col-md-6'>
                    <div className='card-body'>
                        <h4 className='card-title'>
                            {props.course.title}
                        </h4>
                        <h5>
                            {props.course.author}
                        </h5>
                        <p className='card-text'>
                            {props.course.description}
                        </p>
                    </div>
                </div>
                <div className='col-md-4 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white btn-outline-dark' to={`/register/${props.course.id}`}>
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
