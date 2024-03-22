import { Link } from "react-router-dom";
import EventModel from "../../model/EventModel";
import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";

export const Event: React.FC<{ event: EventModel }> = (props) => {

    const { authState } = useOktaAuth();

    const [httpError, setHttpError] = useState(null);

    const startDate = new Date(props.event.startDate);
    const endDate = new Date(props.event.endDate);

    const startLongMonth = startDate.toLocaleString('en-us', { month: 'long' });
    const startDateDay = startDate.getDate();
    const startDateYear = startDate.getFullYear();

    const endLongMonth = endDate.toLocaleString('en-us', { month: 'long' });
    const endDateDay = endDate.getDate();
    const endDateYear = endDate.getFullYear();

    const startDateRender = startLongMonth + ' ' + startDateDay + ', ' + startDateYear;
    const endDateRender = endLongMonth + ' ' + endDateDay + ', ' + endDateYear;

    const onRegister = async () => {
        
        const data = {
            username: props.event.authUser,
            courseId: props.event.courseId,
            startDate: props.event.startDate,
            endDate: props.event.endDate,
        }

        const registerUrl = `http://localhost:8080/api/user/${props.event.authUser}/enroll`;

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
            alert('Enrollment successful!');

        } catch (error: any) {
            console.error('Error user enroll:', error);
            setHttpError(error.message);
        }
    };

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    return (
        <div>
            <div className='col-sm-12 col-md-12'>
                <div className='row'>
                    <div className='col mt-2'>
                        Start date: {startDateRender}
                    </div>
                    <div className='col mt-2'>
                        End date: {endDateRender}
                    </div>
                    <div className='col mt-2'>
                        Available places: {props.event.places}
                    </div>
                    <div className='col mt-2'>
                        Max. places: {props.event.maxPlaces}
                    </div>
                    <div className='col'>
                        {authState?.isAuthenticated ?
                            <button className='btn main-color text-white btn-outline-dark' onClick={() => onRegister()}>
                                Register
                            </button>
                            :
                            <Link className='btn btn-md main-color text-white btn-outline-dark' to='/login'>
                                Register
                            </Link>
                        }
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
}