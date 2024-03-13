import { Link } from "react-router-dom";
import EventModel from "../../model/EventModel";
import { useOktaAuth } from "@okta/okta-react";

export const Event: React.FC<{ event: EventModel }> = (props) => {

    const {authState} = useOktaAuth();

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
                        <Link className='btn btn-md main-color text-white btn-outline-dark' to='#'>
                            Register
                        </Link>
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
