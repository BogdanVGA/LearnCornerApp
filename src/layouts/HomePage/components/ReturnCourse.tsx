import React from 'react'
import CourseModel from '../../../model/CourseModel';
import { Link } from 'react-router-dom';

export const ReturnCourse: React.FC<{ course: CourseModel }> = (props) => {

    return (
        <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
            <div className='text-left'>
                {props.course.image ?
                    <img
                        src={`data:image/jpeg;base64,${props.course.image}`}
                        className='col-9'
                        height='200'
                        alt='Course'
                    />
                    :
                    <img
                        src={require('./../../../Images/CoursesImages/diesel_eng.jpg')}
                        width='col-9'
                        height='233'
                        alt='Course'
                    />
                }
                <h5 className='mt-4'>{props.course.title}</h5>
                <h6>{props.course.author}</h6>
                <p>{props.course.courseType === 'online' ? 'Online course' : 'Onsite course'}</p>
                <Link className='btn col-9 main-color text-white btn-outline-dark' to={`/register/${props.course.id}`}>
                    Register
                </Link>

            </div>
        </div>
    );
}
