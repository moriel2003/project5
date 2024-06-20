import React, { useState } from 'react';
import Login from '../components/Login';
import SignIn from '../components/Signin';
import {Link, Route, Routes, Navigate} from "react-router-dom"
import UserDetails from '../components/UserDetails';
import Home from '../components/Home'
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path = "/register" element ={<SignIn/>}/>
      <Route path = "/home/*" element ={<Home />}/>
      <Route path = "/details" element ={<UserDetails/>}/>
    </Routes>
    </>
  )
}

export default App
