import React, { useState } from 'react';
import styles from '../styles/SignIn.module.css'; // Import CSS module
import {Link, Route, Routes,useNavigate} from "react-router-dom"

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

  
    if (username === '' || password === '' || verifyPassword === '') {
      setError('Please fill in all fields');
      return;
    }
    if (password !== verifyPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
  
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) {
        throw new Error('Failed to fetch existing users');
      }
      const existingUsers = await response.json();

      // Check if username already exists
      const usernameExists = existingUsers.some(user => user.username === username);
      if (usernameExists) {
        setError('Username already exists');
        return;
      }

      const user = {
        id: existingUsers.length + 1,
        username: username,
        password: password
      };

      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate("/details");
    //   props.setIsSignIn(false);
    //   props.setIsDetails(true);


    
      // Clear form fields
      setUsername('');
      setPassword('');
      setVerifyPassword('');
      setError('');

    } catch (error) {
      console.error('Error creating user:', error.message);
      alert('Failed to create user. Please try again.');
    }
  };

  const handleLogInClick = () => {
    navigate('/');
  };

  return (
    <div className={styles['signin-container']}>
      <h2>Sign In</h2>
      {error && <div className={styles['error-message']}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles['form-group']}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles['form-control']}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles['form-control']}
          />
        </div>
        <div className={styles['form-group']}>
          <label htmlFor="verifyPassword">Verify Password:</label>
          <input
            type="password"
            id="verifyPassword"
            value={verifyPassword}
            onChange={(e) => setVerifyPassword(e.target.value)}
            className={styles['form-control']}
          />
        </div>
        <button type="submit" className={styles['btn-primary']}>Sign In</button>
        <button type="button"onClick={handleLogInClick}>log in</button>
      </form>
    </div>
  );
}

export default SignIn;
