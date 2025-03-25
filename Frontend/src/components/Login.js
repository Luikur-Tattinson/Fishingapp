import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
      username: '',
      password: '',
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try 
        {
            const response = await axios.post('http://localhost:8000/api/token/', {
                username: formData.username,
                password: formData.password,
            });
        
        const { access, refresh, username } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshtoken', refresh);
        localStorage.setItem('username', username);

        dispatch(login({ username }));
        alert('Login successful');
        navigate('/');
      } 
      catch (error)
      {
        console.error(error);
        alert('Login failed: invalid credentials');
      }
    };

      return (
            <Container className="mt-4">
              <h2>Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
        
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
        
                <Button variant="primary" type="submit">
                  Login
                </Button>
              </Form>
              <p>No account? Register <a className="text-success" href="/register">here</a></p>
            </Container>
          );
}

export default Login;