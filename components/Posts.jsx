import React, { useState, useEffect } from 'react';
import classes from '../styles/Todos.module.css';
import { useParams,Link } from 'react-router-dom';

function Posts() {
    const [isLoading,setIsLoading]=useState(true);
    const [posts,setPosts]=useState([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const{ id } = useParams();
    //a use effect to fetch the posts on initiall mouning
    useEffect(()=>{
        const fetchPosts=async()=>{
        try{
            const response=await fetch("http://localhost:3000/posts");
            if (!response.ok) {
                throw new Error('Failed to fetch Posts');
              }
              const data = await response.json();
              setPosts(data);
              setIsLoading(false);


        }
        catch(err){
            alert(err);
        }
    }
        fetchPosts();
    },[])

    return (
        <div className={classes['container']}>
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <h1>Posts</h1>
                    <ul className={classes['Posts-list']}>
                        {posts.map(post => (
                            <li key={post.id}>
                            <span>id:{post.id} title:{post.title}</span>
                            <Link to ={`post/${post.id}`}>show post</Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default Posts;
