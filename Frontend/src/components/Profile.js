import React from 'react';
import { useSelector } from 'react-redux';

function Profile()
{
    const username = useSelector((state) => state.auth.username);
    console.log(username);

    if (!username)
    {
        return <p>Loading profile...</p>;
    }

    return(
    <div>
        <p>Welcome, {username}</p>   
    </div>
)
}

export default Profile;