import React, { useState } from 'react';
import classes from '../styles/Login.module.css';
import {Link, Route, Routes,useNavigate} from "react-router-dom";

function UserDetails() {
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name === '' || email === '' || phone === '') {
      setError('Please fill in all fields');
      return;
    }

    try {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      user = {
        ...user,
        name: name,
        phone: phone,
        email: email
      };
      localStorage.setItem('currentUser',JSON.stringify(user));

      const response = await fetch("http://localhost:3000/users", {
        method: 'POST',
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }



    } catch (error) {
      console.error('Error adding user:', error);
    }

    setName('');
    setEmail('');
    setPhone('');
    setError('');

    navigate("/home")
    // props.setIsDetails(false);
    // props.setIsHome(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes['form-group']}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={classes['form-control']}
        />
      </div>
      <div className={classes['form-group']}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={classes['form-control']}
        />
      </div>
      <div className={classes['form-group']}>
        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={classes['form-control']}
        />
      </div>
      {error && <div className={classes['error-message']}>{error}</div>}
      <button type="submit" className={classes['btn-primary']}>Submit</button>
    </form>
  );
}

export default UserDetails;
