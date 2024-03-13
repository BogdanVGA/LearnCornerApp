import { Link } from "react-router-dom";

export const ExploreCourses = () => {
    return (
        <div className='p-3 mb-3 bg-dark header'>
            <div className='container-fluid py-5 text-white 
                d-flex justify-content-center align-items-center'>
                <div>
                    <h1 className='display-5 fw-bold'>Start your next learning journey</h1>
                    <p className='col-md-8 fs-4'>Where would you like to go next?</p>
                    <Link type='button' className='btn main-color btn-lg text-white btn-outline-secondary' to='/search'>
                        Explore courses
                    </Link>
                </div>
            </div>
        </div>
    );
}
