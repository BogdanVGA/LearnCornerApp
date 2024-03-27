import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { useOktaAuth } from "@okta/okta-react";
import { Modal } from "../Utils/Modal";

export const UserProfile = () => {

    const { oktaAuth, authState } = useOktaAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const [fullName, setFullName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [username, setUsername] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (authState && authState.isAuthenticated) {

                try {
                    const userInfo = await oktaAuth.getUser();
                    const baseUrl: string = `http://localhost:8080/api/user?username=${userInfo.preferred_username}`;
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

                    const userData = await response.json();

                    setValue('firstName', userData.firstName);
                    setValue('lastName', userData.lastName);
                    setValue('username', userData.username);
                    setValue('email', userData.email);

                    setFullName(userData.firstName + ' ' + userData.lastName);
                    setAccountType(userData.userRole);
                    setUsername(userData.username);

                } catch (error: any) {
                    setModalMessage(error.message);
                    setShowModal(true);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, [oktaAuth, authState, setValue]);

    const onSubmit = async (data: any) => {

        const updateUrl = `http://localhost:8080/api/user/update?username=${username}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch(updateUrl, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile: ${errorText}`);
            }

            const updatedUserData = await response.json();
            console.log(updatedUserData);
            setModalMessage('Profile updated successfully!');
            setShowModal(true);

        } catch (error: any) {
            setModalMessage(error.message);
            setShowModal(true);
        }
    };

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
            <Modal showModal={showModal} modalMessage={modalMessage} onClose={onCloseModal}/>
            <div className='container rounded bg-white mt-5 mb-5'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='col-md-3 border-right'>
                            <div className='d-flex flex-column align-items-center text-center p-3 py-5'>
                                <img
                                    className='rounded-circle mt-5'
                                    width='150px'
                                    src='https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg'
                                    alt='User'>
                                </img>
                                <div className='col-md-6'>
                                    <label className='font-weight-bold'>{fullName}</label>
                                </div>
                                <div>
                                    <label className='text-black-80'>Account type: {accountType}</label>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5 border-right'>
                            <div className='p-3 py-5'>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h4 className='text-right'>Profile Settings</h4>
                                </div>
                                <div className='row mt-2'>
                                    <div className='col-md-6'>
                                        <label className='labels'>First Name</label>
                                        <input {...register('firstName', { required: true })} type='text' className='form-control mt-1' />
                                        {errors.firstName && <span className="text-danger">First name is required.</span>}
                                    </div>
                                    <div className='col-md-6'>
                                        <label className='labels'>Last Name</label>
                                        <input {...register('lastName', { required: true })} type='text' className='form-control mt-1' />
                                        {errors.lastName && <span className="text-danger">Last name is required.</span>}
                                    </div>
                                </div>
                                <div className='row mt-3'>
                                    <div className='col-md-12'>
                                        <label className='labels'>Username</label>
                                        <input {...register('username', { required: true })} type='text' className='form-control mt-1' />
                                        {errors.username && <span className="text-danger">Username is required.</span>}
                                    </div>
                                    <div className='col-md-12 mt-3'>
                                        <label className='labels'>Email</label>
                                        <input {...register('email', { required: true })} type='text' className='form-control mt-1' />
                                        {errors.email && <span className="text-danger">Email is required.</span>}
                                    </div>
                                </div>
                                <div className='mt-5 text-right'>
                                    <button className='btn btn-outline-dark main-color text-white profile-button' type='submit'>
                                        Save Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* https://freefrontend.com/bootstrap-profiles/ */
/* https://react-hook-form.com/get-started#Registerfields */
/* https://www.npmjs.com/package/throttle-typescript */