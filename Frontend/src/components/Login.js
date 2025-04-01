import React, { useState } from 'react';
import { Form, Button, Container, Modal } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
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
            const response = await axiosInstance.post('http://localhost:8000/api/token/', {
                username: formData.username,
                password: formData.password,
            });
        
        const { access, refresh, username } = response.data;
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
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


  //Forgot password modal
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');

  const handleClose = () => {
    setShow(false);
    setEmail('');
  }
  const handleShow = () => setShow(true);

  const resetPasswordSubmit = async (e) => {
    e.preventDefault();

    try
    {
      const response = await axiosInstance.post('http://localhost:8000/api/forgot-password/', {
        email: email,
      });
      console.log(response);
      alert('If an email was found, recovery instructions have been sent');
      handleClose();
    } catch (error)
    {
      console.error(error);
      handleClose();
    }
  }

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

              <button className="btn btn-link nav-link" onClick={handleShow}>Forgot Password?</button>
              <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
              <Modal.Title>Enter your email</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={resetPasswordSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
                </Form>
              </Modal.Body>
              </Modal>
            </Container>
          );
}

export default Login;