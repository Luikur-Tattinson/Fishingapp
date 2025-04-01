import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function Profile()
{
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try
            {
                const token = localStorage.getItem('accessToken');
                const response = await axiosInstance.get('http://localhost:8000/api/me/');
                setProfile(response.data);
            } catch (error)
            {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    return(
    <div>
        <p>Profile page</p>
        {profile ? (
            <>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <a className="btn btn-primary" href="/editprofile">Edit profile</a>
            </>
        ) : (
            <p>Loading profile...</p>
        )}
    </div>
);
}

export default Profile;