import React, { useState, useEffect } from 'react';
import classes from '../styles/Home.module.css';
import Info from '../components/Info';
import Todos from '../components/Todos';
import Albums from '../components/Albums';
import Posts from './Posts';
import Post from './Post'
import Album from './Album';

import { Routes, Route, Link, useNavigate } from 'react-router-dom';

function Home(props) {
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
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
          <Link to={`posts/${currentUser.id}`} className={classes['btn-primary']}>Posts</Link>
          <Link to={`albums/${currentUser.id}`} className={classes['btn-primary']}>Albums</Link>

          <button className={classes['btn-primary']} onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <Routes>
        <Route path="info" element={<Info />} />
        <Route path="todos" element={<Todos />} />
        <Route path="albums/:id" element ={<Albums />}/>
        <Route path="albums/:id/album/:albumId" element ={<Album />}/>
        <Route path="posts/:id" element ={<Posts />}/>
        <Route path="posts/:id/post/:postId" element ={<Post />}/>

      </Routes>
    </div>
  );
}

export default Home;
