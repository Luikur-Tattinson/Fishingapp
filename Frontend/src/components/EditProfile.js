import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function EditProfile()
{
    const [profile, setProfile] = useState(null);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try
        {
            const token = localStorage.getItem('accessToken');
            const response = await axiosInstance.patch('http://localhost:8000/api/me/', profile, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(response.data);
            alert("Changes saved");
            navigate("/profile");
        } catch (error)
        {
            console.error('Error updaging profile:', error);
            setStatus('error');
        }
    };

    return(
        <div>
        <h2>Edit profile</h2>
        {profile ? (
            <>
            <Container className="mt-4">
      {status === 'success' && <Alert variant="success">Profile updated successfully!</Alert>}
      {status === 'error' && <Alert variant="danger">Failed to update profile.</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>   
      </Form>
    </Container>
            </>
        ) : (
            <p>Loading profile...</p>
        )}
    </div>
    );
}

export default EditProfile;