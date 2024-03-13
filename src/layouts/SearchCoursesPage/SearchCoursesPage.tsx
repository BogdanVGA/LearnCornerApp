import { useEffect, useState } from "react";
import CourseModel from "../../model/CourseModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchCourse } from "./components/SearchCourse";
import { Pagination } from "../Utils/Pagination";

export const SearchCoursesPage = () => {
    const [courses, setCourses] = useState<CourseModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [coursesPerPage] = useState(4);
    const [totalAmountOfCourses, setTotalAmountOfCourses] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Category');

    useEffect(() => {

        const fetchCourses = async () => {
            const baseUrl: string = "http://localhost:8080/api/courses";

            let url: string = '';

            if (searchUrl === '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${coursesPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Error retrieving search results...');
            }

            const responseJson = await response.json();

            const responseData = responseJson.content;

            setTotalAmountOfCourses(responseJson.totalElements);
            setTotalPages(responseJson.totalPages);

            const loadedCourses: CourseModel[] = [];

            for (const key in responseData) {
                loadedCourses.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    category: responseData[key].category,
                    courseType: responseData[key].courseType,
                    image: responseData[key].image,
                });
            }

            setCourses(loadedCourses);
            setIsLoading(false);
        };
        fetchCourses().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/byTitle?title=${search}&page=<pageNumber>&size=${coursesPerPage}`)
        }
        setCategorySelection('Category');
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (
            value === 'Automotive' || 
            value === 'Electronics' || 
            value === 'Electrical Engineering' || 
            value === 'Computer Science' ||
            value === 'Mechanical Engineering'
        ) {
            setCategorySelection(value);
            setSearchUrl(`/search/byCategory?category=${value}&page=<pageNumber>&size=${coursesPerPage}`)
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${coursesPerPage}`)
        }
    }

    const indexOfLastCourse: number = currentPage * coursesPerPage;
    const indexOfFirstCourse: number = indexOfLastCourse - coursesPerPage;
    let lastItem = coursesPerPage * currentPage <= totalAmountOfCourses ?
        coursesPerPage * currentPage : totalAmountOfCourses;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Course title' aria-labelledby='Search' 
                                    onChange={e => setSearch(e.target.value)} />
                                <button className='btn btn-outline-dark'                                    
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown'
                                    aria-expanded='false'>
                                    {categorySelection}
                                </button>
                                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={() => categoryField('All')}>
                                        <a className='dropdown-item' href='#'>
                                            All
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Automotive')}>
                                        <a className='dropdown-item' href='#'>
                                            Automotive
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Computer Science')}>
                                        <a className='dropdown-item' href='#'>
                                            Computer Science
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Electronics')}>
                                        <a className='dropdown-item' href='#'>
                                            Electronics
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Electrical Engineering')}>
                                        <a className='dropdown-item' href='#'>
                                            Electrical Engineering
                                        </a>
                                    </li>
                                    <li onClick={() => categoryField('Mechanical Engineering')}>
                                        <a className='dropdown-item' href='#'>
                                            Mechanical Engineering
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {totalAmountOfCourses > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: ({totalAmountOfCourses})</h5>
                            </div>
                            <p>
                                {indexOfFirstCourse + 1} to {lastItem} of {totalAmountOfCourses} items:
                            </p>
                            {courses.map(course => (
                                <SearchCourse course={course} key={course.id} />
                            ))}
                        </>
                        :
                        <div className='mt-4'>
                            <h3>
                                Can't find what you are looking for?
                            </h3>
                            <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                                href='#'>Contact us</a>
                        </div>
                    }

                    { /* only render <Pagination/> if totalPages > 1 */}
                    {totalPages > 1 &&
                        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
                    }

                </div>
            </div>
        </div>
    );    
}