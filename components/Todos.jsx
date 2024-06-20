import React, { useState, useEffect } from 'react';
import classes from '../styles/Todos.module.css';

function Todos() {
  const todos=[];//local array to hold all todos of the current user
  const [todosForDisplay,setTodosForDisplay]=useState([]);// useState to hold the todos for display -sorted.
  const [sortCriteria, setSortCriteria] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState(''); 
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));



//use effect to get this users todos when the compoonent mounts and update the todos state
useEffect(() => {
    const fetchTodos = async () => {
          try {
            const response = await fetch(`http://localhost:3000/todos?userId=${userId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch todos');
            }
            const todosData = await response.json();
            todos=todosData;
            setTodosForDisplay(todosData);
          } catch (error) {
            console.error('Error fetching todos:', error);
          }
        };
//call the async function to get the todos
fetchTodos();
      
    
  }, []);

//use effect to change the todos that are being displayed when the sorting criteria changes
  useEffect(() => {
    const sortTodos = async () => {
        let sorted=todos;
        switch (sortCriteria) {
          case 'finished':
           sorted=todos.map((todo)=>{completed=== true});
          break;
          case 'notFinished':
            sorted=todos.map((todo)=>{completed=== false});
            
            break;
 
          default:
            break;
        }
        setTodosForDisplay(sorted);
    };
    //call the async function 
    sortTodos();
    }, [sortCriteria]);



  const handleSortChange = (criterion) => {
    setSortCriteria(criterion);
  };
  

  // this function adds a new todo
  const handleSubmitAddTodo = async (event) => {
    event.preventDefault();
    if (!newTodoTitle) return;
    try {
        //post the new todo
    }
    catch(err){
        console.log(err);
    }

  };

  const handleDeleteTodo = async (id) => {
    /////////
  };

  return (
    <div className={classes['container']}>
      <h1>User Todos</h1>
      <div className={classes['sort-container']}>
        <button className={classes['sort-button']}>Sort By</button>
        <div className={classes['dropdown-content']}>
          <a href="#" onClick={() => handleSortChange('finished')}>finished</a>
          <a href="#" onClick={() => handleSortChange('notFinished')}>not Finished</a>
          <a href="#" onClick={() => handleSortChange('random')}>random</a>
          <a href="#" onClick={() => handleSortChange('byId')}>by Id</a>
          <a href="#" onClick={() => handleSortChange('alphabetical')}>alphabetical</a>
        </div>
      </div>

      <form onSubmit={handleSubmitAddTodo}>
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter new todo title"
        />
        <button type="submit">Add Todo</button>
      </form>

      <ul className={classes['todo-list']}>
        {todosForDisplay.map(todo => (
          <li key={todo.id} className={classes['todo-item']}>
            <span className={classes['todo-id']}>ID: {todo.id}</span>
            <h3 className={classes['todo-title']}>{todo.title}</h3>
            <input
              type="checkbox"
              checked={todo.completed}
              className={classes['todo-checkbox']}
            />
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
