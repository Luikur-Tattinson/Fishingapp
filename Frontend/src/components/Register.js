import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';

function Register() {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword)
      {
        alert("Passwords do not match!");
        return;
      }

      try
      {
        const response = await axiosInstance.post('http://localhost:8000/register/',
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        alert(response.data.message);
        window.location.href = '/login'
      }
      catch (error)
      {
        console.error(error);
        alert(
          error.response?.data?.error ||
          'An error occured during the registration.'
        );
      }
    };
  
    return (
      <Container className="mt-4">
        <h2>Register</h2>
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
  
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
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
  
          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </Form.Group>
  
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <p>Already a user? Login <a className="text-success" href="/login">here</a></p>
      </Container>
    );
  }
  
  export default Register;