import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile()
{
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try
            {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
            <a class="btn btn-primary" href="/editprofile">Edit profile</a>
            </>
        ) : (
            <p>Loading profile...</p>
        )}
    </div>
);
}

export default Profile;