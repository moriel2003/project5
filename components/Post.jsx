import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classes from '../styles/Todos.module.css';

function Post() {
  const [currentPost, setCurrentPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();
  const [isComments, setIsComments] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newCommentName, setNewCommentName] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const postData = await response.json();
        setCurrentPost(postData);

        const commentResponse = await fetch(`http://localhost:3000/comments?postId=${postId}`);
        if (!commentResponse.ok) {
          throw new Error('Failed to fetch comments');
        }
        const commentsData = await commentResponse.json();
        setCommentsList(commentsData);
        setIsLoading(false);
      } catch (err) {
        alert(err);
      }
    };
    fetchPost();
  }, [postId]);

  const handleTitleBlur = async (updatedComment) => {
    try {
      const response = await fetch(`http://localhost:3000/comments/${updatedComment.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedComment),
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      const updatedCommentData = await response.json();
      const updatedCommentsList = commentsList.map(c =>
        c.id === updatedCommentData.id ? updatedCommentData : c
      );
      setCommentsList(updatedCommentsList);
    } catch (err) {
      alert(err);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/comments');
      if (!res.ok) {
        throw new Error('Failed to get comments');
      }
      const allComments = await res.json();
      const id =
        allComments.length > 0 ? parseInt(allComments[allComments.length - 1].id) + 1 : 1;

      const response = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: postId,
          id: id.toString(),
          name: newCommentName,
          email: currentUser.email,
          body: newComment,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      const newCommentData = await response.json();
      setCommentsList([...commentsList, newCommentData]);
      setNewComment('');
      setNewCommentName('');
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className={classes.container}>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <h2 className={classes.todoTitle}>{currentPost.title}</h2>
          <p>{currentPost.body}</p>
          <button onClick={() => setIsComments(!isComments)}>
            {isComments ? 'Hide comments' : 'Show comments'}
          </button>
          {isComments && (
            <>
              <ul className={classes['Posts-list']}>
                {commentsList.map((c) => (
                  <li key={c.id}>
                    <span>Email: {c.email}</span>
                    <input
                      type="text"
                      className={classes['todo-title']}
                      value={c.name}
                      onChange={(e) => {
                        const updatedComment = { ...c, name: e.target.value };
                        handleTitleBlur(updatedComment);
                      }}
                      onBlur={() => handleTitleBlur(c)}
                      disabled={c.email !== currentUser.email}
                    />
                    <input
                      type="text"
                      className={classes['todo-title']}
                      value={c.body}
                      onChange={(e) => {
                        const updatedComment = { ...c, body: e.target.value };
                        handleTitleBlur(updatedComment);
                      }}
                      onBlur={() => handleTitleBlur(c)}
                      disabled={c.email !== currentUser.email}
                    />
                  </li>
                ))}
              </ul>
              <form onSubmit={handleSubmitComment}>
                <input
                  type="text"
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  placeholder="Enter new Comment Name"
                  required
                />
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Enter new Comment"
                  required
                />
                <button type="submit">Add comment</button>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Post;
