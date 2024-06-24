import React, { useState, useEffect } from 'react';
import classes from '../styles/Todos.module.css';
import { useParams,Link } from 'react-router-dom';

function Posts() {
    const [isLoading,setIsLoading]=useState(true);
    const [posts,setPosts]=useState([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const{ id } = useParams();
    const [newPostTitle,setnewPostTitle]=useState('');
    const [newPostBody,setnewPostBody]=useState('');

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


    const handleSubmitAddPost=async (event) => {
        event.preventDefault();try {
          // Fetch  all posts to get the current length for new post id
          const response = await fetch(`http://localhost:3000/posts`);
          if (!response.ok) {
            throw new Error('Failed to fetch todos');
          }
          const postsData = await response.json();
    
          let id=postsData.length > 0?
          parseInt(postsData[postsData.length - 1].id) + 1
          :1;
          id = id.toString();
        
          
    
          const newPost = {
            userId: currentUser.id,
            id: id,
            title: newPostTitle,
            body: newPostBody
          };
    
          // Add new post to backend
          const res = await fetch("http://localhost:3000/posts", {
            method: 'POST',
            body: JSON.stringify(newPost)
          });
    
          if (!res.ok) {
            throw new Error('Failed to add todo');
          }
    
          // Update 
          setPosts([...posts, newPost]);

    
          // Clear input field after adding a post 
          setnewPostBody('');
          setnewPostTitle('');
    
        } catch (err) {
          console.log(err);
        }
      };
    const handleDeletePost=async (id) => {
        try {
            const res = await fetch(`http://localhost:3000/posts/${id}`, {
            method: "DELETE"
          });
          
          if (!res.ok) {
            throw new Error('Failed to delete post');
          }
    
          const updatedPosts = posts.filter(p => p.id !== id);
          setPosts(updatedPosts);
    
        } catch (err) {
          console.error('Error deleting post:', err);
        }
      };

    return (
        <div className={classes['container']}>
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    <h1>Posts</h1>
                    <form onSubmit={handleSubmitAddPost}>
                        <input
                         type="text"
                         value={newPostTitle}
                         onChange={(e) => setnewPostTitle(e.target.value)}
                         placeholder="Enter new post title"
                         required/>
                         <input
                         type="text"
                         value={newPostBody}
                         onChange={(e) => setnewPostBody(e.target.value)}
                         placeholder="Enter new post body "
                         required/>
                    <button type="submit">Add Post</button>
                    </form>
    
                    <ul className={classes['Posts-list']}>
                        {posts.map(post => (
                            <li key={post.id}>
                            <span>id:{post.id} title:{post.title}</span>
                            <Link to ={`post/${post.id}`}>show post</Link>
                            <button onClick={() => handleDeletePost(post.id)} disabled={post.userId!==currentUser.id}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default Posts;
