import { NavLink } from "react-router-dom";

export const Footer = () => {
    return (
        <div className='main-color'>
            <footer className='container d-flex flex-wrap 
                justify-content-between align-items-center py-5 main-color'>
                <p className='col-md-4 mb-0 text-white'>© Learn Corner</p>
                <ul className='nav navbar-dark col-md-4 justify-content-end'>
                    <li className='nav-item'>
                        <NavLink to='/home' className='nav-link px-2 text-white'>Home</NavLink>
                    </li>
                    <li className='nav-item'>
                        <NavLink to='/search' className='nav-link px-2 text-white'>Search Courses</NavLink>
                    </li>
                </ul>
            </footer>
        </div>
    );
}
