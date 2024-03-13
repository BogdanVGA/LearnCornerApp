import React from "react";
import UserHistoryModel from "../../../model/UserHistoryModel";

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


    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    {/* div for desktop version */}
                    <div className='d-none d-lg-block'>
                        {props.userHistoryItem.courseImage ?
                            <img src={`data:image/jpeg;base64,${props.userHistoryItem.courseImage}`}
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
                        {props.userHistoryItem.courseImage ?
                            <img src={`data:image/jpeg;base64,${props.userHistoryItem.courseImage}`}
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
                </div>
                <div className='col-md-4'>
                    <div className='card-body'>
                        <h4 className='card-title'>
                            {props.userHistoryItem.courseTitle}
                        </h4>
                        <h5>
                            Status: {props.userHistoryItem.status}
                        </h5>
                        <p>
                            {props.userHistoryItem.courseType === 'online' ? 'Online course' : 'Onsite course'}
                        </p>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='card-body'>
                        <div className='card-title mt-1'>
                            Start date: {startDateRender}
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className='card-body'>
                        <div className='card-title mt-1'>
                            {props.userHistoryItem.courseType === 'online' ? 
                            ''
                            : 
                            `End date: ${endDateRender}`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
