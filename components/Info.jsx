import React, { useState, useEffect } from 'react';
import classes from '../styles/Info.module.css'; 

function Info() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      try {
        const userData = JSON.parse(currentUserString);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing currentUser from localStorage:', error);
      }
    }
  }, []);

  if (!user) {
    return <div className={classes['container']}>Loading...</div>;
  }

  return (
    <div className={classes['container']}>
      <h1>User Information</h1>
      <div className={classes['info']}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
      </div>
    </div>
  );
}

export default Info;
