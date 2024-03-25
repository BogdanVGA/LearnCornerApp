import EventModel from "../../model/EventModel";
import { Event } from "../Utils/Event";

export const CourseEvents: React.FC<{ events: EventModel[], mobile: boolean }> = (props) => {

    return (
        <div className={props.mobile ? 'mt-3' : 'row mt-3'}>
            <div className={props.mobile ? '' : 'col-sm-2 col-md-2 mt-2'}>
                <h5>Available events: </h5>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.events.length > 0 ?
                    <>
                        {props.events.map(eachEvent => (
                            <Event event={eachEvent} key={eachEvent.id}></Event>
                        ))}
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
