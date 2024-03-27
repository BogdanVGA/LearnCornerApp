import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import UserHistoryModel from "../../../model/UserHistoryModel";
import { UserHistoryItem } from "./UserHistoryItem";
import { Link } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { Modal } from "../../Utils/Modal";

export const UserCoursesPage = () => {

    const { oktaAuth, authState } = useOktaAuth();

    const [userHistory, setUserHistory] = useState<UserHistoryModel[]>([]);
    const [totalHistoryItems, setTotalHistoryItems] = useState(0);

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            if (authState && authState.isAuthenticated) {

                try {
                    const loadedUsername = (await oktaAuth.getUser()).preferred_username;
                    const baseUrl: string = `http://localhost:8080/api/user/${loadedUsername}/courses`;
                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                            'Content-Type': 'application/json'
                        }
                    };

                    const response = await fetch(baseUrl, requestOptions);
                    if (!response.ok) {
                        throw new Error('Error retrieving user course history...');
                    }
                    const responseJson = await response.json();

                    const loadedUserHistoryItems: UserHistoryModel[] = [];
                    for (const key in responseJson) {
                        loadedUserHistoryItems.push({
                            rowId: responseJson[key].rowId,
                            courseId: responseJson[key].courseId,
                            courseTitle: responseJson[key].courseTitle,
                            courseType: responseJson[key].courseType,
                            courseImage: responseJson[key].courseImage,
                            startDate: responseJson[key].startDate,
                            endDate: responseJson[key].endDate,
                            status: responseJson[key].status,
                        });
                    }

                    setTotalHistoryItems(loadedUserHistoryItems.length);
                    setUserHistory(loadedUserHistoryItems);

                } catch (error: any) {
                    setModalMessage(error.message);
                    setShowModal(true);
                } finally {
                    setIsLoading(false)
                }
            }
            setIsLoading(false);
        };
        fetchCourses();
    }, [authState, oktaAuth]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    const onCloseModal = () => {
        setShowModal(false);
    }

    return (
        <div>
            <Modal showModal={showModal} modalMessage={modalMessage} onClose={onCloseModal} />
            <div className='container'>
                <div>
                    {totalHistoryItems > 0 ?
                        <>
                            <div className='mt-3 mb-3'>
                                <h5>Number of results: {totalHistoryItems}</h5>
                            </div>
                            {userHistory.map(userHistoryItem => (
                                <UserHistoryItem userHistoryItem={userHistoryItem} key={userHistoryItem.rowId} />
                            ))}
                        </>
                        :
                        <div className='mt-4'>
                            <h3>
                                Ready to start your learning journey?
                            </h3>
                            <Link type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-white'
                                to='/search'>Search Courses</Link>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
