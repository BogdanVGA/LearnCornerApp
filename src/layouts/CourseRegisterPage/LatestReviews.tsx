import ReviewModel from "../../model/ReviewModel";
import { Review } from "../Utils/Review";

export const LatestReviews: React.FC<{ reviews: ReviewModel[], courseId: number | undefined, mobile: boolean }> = (props) => {

    return (
        <div className={props.mobile ? 'row mt-3' : 'row mt-3'}>
            <div className='col-sm-2 col-md-2'>
                <h5>Latest Reviews: </h5>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.reviews.length > 0 ?
                    <>
                        {props.reviews.map(eachReview => (
                            <Review review={eachReview} key={eachReview.id}></Review>
                        ))}
                    </>
                    :
                    <div>
                        <p className='lead'>
                            Currently there are no reviews for this course
                        </p>
                    </div>
                }
            </div>
        </div>
    );
}
