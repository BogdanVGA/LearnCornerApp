import { Link } from "react-router-dom";
import EventModel from "../../model/EventModel";
import { Event } from "../Utils/Event";

export const CourseEvents: React.FC<{ events: EventModel[], courseId: number | undefined, mobile: boolean }> = (props) => {

    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-5'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2'}>
                <h5>Available events: </h5>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.events.length > 0 ?
                    <>
                        {props.events.slice(0, 3).map(eachEvent => (
                            <Event event={eachEvent} key={eachEvent.id}></Event>
                        ))}
                        <Link type='button' className='btn main-color btn-md text-white btn-outline-dark'
                            to='#'>
                            See all events
                        </Link>
                    </>
                    :
                    <div>
                        <p className='lead'>
                            Currently there are no available events for this course.
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}
