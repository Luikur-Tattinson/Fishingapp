import React from 'react';
import { useSelector } from 'react-redux';

function Home()
{
    const username = useSelector((state) => state.auth.username);

    return(
        <div>
            {username ? (
            <p>Welcome, {username}</p>
            ) : (
                <p>Home</p>
            )}       
        </div>
    )
}

export default Home;