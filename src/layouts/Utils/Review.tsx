import ReviewModel from "../../model/ReviewModel";
import { StarsReview } from "./StarsReview";

export const Review: React.FC<{ review: ReviewModel }> = (props) => {

    const date = new Date(props.review.date);

    const longMonth = date.toLocaleString('en-us', { month: 'long' });
    const dateDay = date.getDate();
    const dateYear = date.getFullYear();

    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;

    return (
        <div>
            <div className='col-sm-10 col-md-10'>
                <div className='row'>
                    <div className='col'>
                        <h5>{props.review.username}</h5>                        
                    </div>
                    <div className='col'>
                        {dateRender}
                    </div>
                    <div className='col'>
                        <StarsReview rating={props.review.rating} size={16} />
                    </div>
                    <div className='col-6'>
                        {props.review.reviewText}
                    </div>
                </div>

            </div>
            <hr />
        </div>
    );
}
