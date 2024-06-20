import React, { useState, useEffect } from 'react';
import classes from '../styles/Home.module.css';
import Info from '../components/Info';
import Todos from '../components/Todos';
import Albom from '../components/Albom';

import { Routes, Route, Link, useNavigate } from 'react-router-dom';

function Home(props) {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    setUserName(currentUser.name || 'User');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className={classes['home-container']}>
      <header className={classes['header']}>
        <h1>Welcome, {userName}!</h1>
        <nav>
          <Link to="info" className={classes['btn-primary']}>Info</Link>
          <Link to="todos" className={classes['btn-primary']}>Todos</Link>
          <Link to="posts" className={classes['btn-primary']}>Posts</Link>
          <Link to="albums" className={classes['btn-primary']}>Albums</Link>
          <button className={classes['btn-primary']} onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <Routes>
        <Route path="info" element={<Info />} />
        <Route path="todos" element={<Todos />} />
        <Route path="album" elemnt ={<Albom />}/>
      </Routes>
    </div>
  );
}

export default Home;
