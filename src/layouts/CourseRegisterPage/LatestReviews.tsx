import { Link } from "react-router-dom";
import ReviewModel from "../../model/ReviewModel";
import { Review } from "../Utils/Review";

export const LatestReviews: React.FC<{ reviews: ReviewModel[], courseId: number | undefined, mobile: boolean }> = (props) => {

    return (
        <div className={props.mobile ? 'row mt-3' : 'row mt-5'}>
            <div className='col-sm-2 col-md-2'>
                <h5>Latest Reviews: </h5>
            </div>
            <div className='col-sm-10 col-md-10'>
                {props.reviews.length > 0 ?
                    <>
                        {props.reviews.slice(0, 3).map(eachReview => (
                            <Review review={eachReview} key={eachReview.id}></Review>
                        ))}
                        <Link type='button' className='btn main-color btn-md text-white btn-outline-dark mb-2'
                            to='#'>
                            Reach all reviews
                        </Link>
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
