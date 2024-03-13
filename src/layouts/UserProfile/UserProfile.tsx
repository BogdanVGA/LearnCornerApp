import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import UserModel from "../../model/UserModel";
import { useOktaAuth } from "@okta/okta-react";

export const UserProfile = () => {

    const { oktaAuth, authState } = useOktaAuth();

    const [userData, setUserData] = useState<UserModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {

        const fetchUserData = async () => {

            if (authState && authState.isAuthenticated) {

                const loadedEmail = (await oktaAuth.getUser()).email;

                const baseUrl: string = `http://localhost:8080/api/user?email=${loadedEmail}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const response = await fetch(baseUrl, requestOptions);

                if (!response.ok) {
                    throw new Error('Error retrieving user data...');
                }

                const responseJson = await response.json();

                const id = responseJson.id;
                const username = responseJson.username;
                const email = responseJson.email;
                const firstName = responseJson.firstName;
                const lastName = responseJson.lastName;
                const userRole = responseJson.userRole;

                const loadedUserData: UserModel = {
                    id: id,
                    username: username,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    userRole: userRole
                }

                setUserData(loadedUserData);
            }
            setIsLoading(false);
        };
        fetchUserData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })

    }, [oktaAuth, authState]);

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

    const fullName = userData?.firstName + ' ' + userData?.lastName;
    const accountType = 'Account type: ' + userData?.userRole;

    return (
        <div className='container rounded bg-white mt-5 mb-5'>
            <div className='row'>
                <div className='col-md-3 border-right'>
                    <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                        <img 
                            className='rounded-circle mt-5'
                            width='150px'
                            src='https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'
                            alt='User'>
                        </img>
                        <span className='font-weight-bold'>{fullName}</span>
                        <span className='text-black-80'>{accountType}</span>
                    </div>
                </div>
                <div className='col-md-5 border-right'>
                    <div className='p-3 py-5'>
                        <div className='d-flex justify-content-between align-items-center mb-3'>
                            <h4 className='text-right'>Profile Settings</h4>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-md-6'><label className='labels'>Name</label>
                                <input type='text' className='form-control mt-1' placeholder={userData?.firstName} />
                            </div>
                            <div className='col-md-6'><label className='labels'>Surname</label>
                                <input type='text' className='form-control mt-1' placeholder={userData?.lastName} />
                            </div>
                        </div>
                        <div className='row mt-2'>
                            <div className='col-md-12 mt-3'><label className='labels'>User name</label>
                                <input type='text' className='form-control mt-1' placeholder={userData?.username} />
                            </div>
                            <div className='col-md-12 mt-3'><label className='labels'>Email</label>
                                <input type='text' className='form-control mt-1' placeholder={userData?.email} />
                            </div>
                        </div>
                        <div className='mt-5 text-right'>
                            <button className='btn main-color text-white profile-button' type='button'>Save Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* https://freefrontend.com/bootstrap-profiles/ */