import React from "react";
import UserHistoryModel from "../../../model/UserHistoryModel";
import { useHistory } from "react-router-dom";

export const UserHistoryItem: React.FC<{ userHistoryItem: UserHistoryModel }> = (props) => {

    const startDate = new Date(props.userHistoryItem.startDate);
    const endDate = new Date(props.userHistoryItem.endDate);

    const startMonth = startDate.toLocaleString('en-us', { month: 'long' });
    const startDay = startDate.getDate();
    const startYear = startDate.getFullYear();

    const endMonth = endDate.toLocaleString('en-us', { month: 'long' });
    const endDay = endDate.getDate();
    const endYear = endDate.getFullYear();

    const startDateRender = startDay + ' ' + startMonth + ' ' + startYear;
    const endDateRender = endDay + ' ' + endMonth + ' ' + endYear;

    const history = useHistory();

    const onAddReview = () => {
        history.push({
            pathname: '/user/review',
            state: { userHistoryItem: props.userHistoryItem }
        });
    };

    return (
        <div className='card shadow mb-3 bg-body rounded'>
            <h4 className='card-header'>
                {props.userHistoryItem.courseType === 'online' ? 'Online course' : 'Onsite course'}
            </h4>
            <div className='row g-0 mt-2 mb-2'>
                <div className='col-md-2 px-2'>
                    {/* div for desktop version */}
                    <div className='d-none d-lg-block'>
                        {props.userHistoryItem.courseImage ?
                            <img src={`data:image/jpeg;base64,${props.userHistoryItem.courseImage}`}
                                className='img-fluid rounded-start'
                                alt='Course'
                            />
                            :
                            <img src={require('../../../Images/CoursesImages/diesel_eng.jpg')}
                                className='img-fluid rounded-start'
                                alt='Course'
                            />
                        }
                    </div>
                    {/* div for the mobile version */}
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.userHistoryItem.courseImage ?
                            <img src={`data:image/jpeg;base64,${props.userHistoryItem.courseImage}`}
                                className='img-fluid rounded-start'
                                alt='Course'
                            />
                            :
                            <img src={require('../../../Images/CoursesImages/diesel_eng.jpg')}
                                className='img-fluid rounded-start'
                                alt='Course'
                            />
                        }
                    </div>
                </div>
                <div className='col-md-10'>
                    <div className='card-body'>
                        <div className='row g-0'>
                            <div className='col-md-4'>
                                <h5 className='card-title'>{props.userHistoryItem.courseTitle}</h5>
                                <h6 className='card-text'>Status: {props.userHistoryItem.status}</h6>
                            </div>
                            <div className='col-md-4'>
                                <p className='card-text'>Start date: {startDateRender}</p>
                                <p className='card-text'>
                                    {props.userHistoryItem.courseType === 'online' ? '' : `End date: ${endDateRender}`}
                                </p>
                            </div>
                            <div className='col-md-2'>
                                <button className='btn main-color text-white btn-outline-dark'>
                                    Open Course
                                </button>
                            </div>
                            <div className='col-md-2'>
                                <button className='btn main-color text-white btn-outline-dark' onClick={onAddReview}>
                                    Add review
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
