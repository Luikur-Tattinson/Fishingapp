import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Navbar from './components/Navbar';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import EditProfile from './components/EditProfile';
import Database from './components/Database';

function App() {
  return(
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/database" element={<Database/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/editprofile" element={<ProtectedRoute><EditProfile/></ProtectedRoute>}/>
      </Routes>
    </>
  );
}

export default App;

