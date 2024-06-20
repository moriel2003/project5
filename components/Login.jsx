import React, { useEffect, useState } from 'react';
import classes from '../styles/Login.module.css'; 
import {Link, Route, Routes,useNavigate} from "react-router-dom"

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === '' || password === '') {
      setError('Please fill in all fields');
      return;
    }
    try{
        const response = await fetch("http://localhost:3000/users");
        if (!response.ok) {
            throw new Error('Failed to fetch existing users');
        }
        const existingUsers = await response.json();
        const user = existingUsers.find(user => user.username === username && user.password === password);
        if (!user) {
          setError('incorrect username or password');
          return;
        }
        //user exist 
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate("/home");

    }
    catch{

    }


  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div className={classes['login-container']}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className={classes['form-group']}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={classes['form-control']}
          />
        </div>
        <div className={classes['form-group']}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes['form-control']}
          />
        </div>
        {error && <div className={classes['error-message']}>{error}</div>}
        <button type="submit" className={classes['btn-primary']}>Login</button>
        <button type="button" onClick={handleSignUpClick} className={classes['btn-secondary']}>Sign Up</button>

        {/* <Link path ="/register">sign up</Link> */}
        {/* <a href="#" onClick={()=>{props.setIslogIn(false); props.setIsSignIn(true)}}>sign up</a> */}

      </form>
    </div>
  );
}

export default Login;
