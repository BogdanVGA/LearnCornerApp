import React from "react";
import UserHistoryModel from "../../model/UserHistoryModel";
import { useLocation } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { useForm } from "react-hook-form";

export const ReviewPage = () => {

    const location = useLocation();
    const state = location.state as { userHistoryItem: UserHistoryModel };

    const { oktaAuth } = useOktaAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (formData: any) => {

        const userinfo = await oktaAuth.getUser();

        const data = {
            username: userinfo.preferred_username,
            courseId: state.userHistoryItem.courseId,
            reviewText: formData.reviewText,
            rating: formData.rating
        }

        const body = JSON.stringify(data);
        console.log(body);
        alert("Review submited successfully!")
    }

    return (
        <div className='container rounded bg-white mt-5 mb-5'>
            <div>
                <h4>Write a course review for '{state.userHistoryItem.courseTitle}'</h4>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group mt-5'>
                    <label htmlFor='reviewText'>Review</label>
                    <textarea
                        {...register('reviewText', { required: true })}
                        id='reviewText'
                        className='form-control mt-1'
                        placeholder='Enter your review text here...'>
                    </textarea>
                    {errors.reviewText && <span className='text-danger'>This field is required.</span>}
                </div>
                <div className='form-group mt-5'>
                    <label htmlFor='rating'>Course rating</label>
                    <select
                        {...register('rating', { required: true })}
                        id='rating'
                        className='form-control mt-1'>
                        <option value=''>Select a rating</option>
                        {Array.from({ length: 5 }, (_, index) => index + 1).map(value => (
                            <option key={value} value={value}>{value}</option>
                        ))}
                    </select>
                    {errors.rating && <span className='text-danger'>Please select a rating.</span>}
                </div>
                <button type='submit' className='btn main-color text-white btn-outline-dark mt-5'>
                    Submit Review
                </button>
            </form>
        </div>
    );
}
