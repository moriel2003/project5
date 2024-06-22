import React, { useState, useEffect } from 'react';
import classes from '../styles/Todos.module.css';

function Todos() {
  const [todos, setTodos] = useState([]); // State to hold all todos of the current user
  const [todosForDisplay, setTodosForDisplay] = useState([]); // State to hold todos for display - sorted
  const [sortCriteria, setSortCriteria] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // State to hold search term
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Fetch todos for the current user when the component mounts
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`http://localhost:3000/todos?userId=${currentUser.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const todosData = await response.json();
        setTodos(todosData); // Update todos state
        setTodosForDisplay(todosData); // Initialize todosForDisplay with fetched data
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, [currentUser.id]);

  // Update todosForDisplay when sorting criteria changes
  useEffect(() => {
    const sortAndFilterTodos = () => {
      let sorted = [...todos]; // Make a copy of todos array

      switch (sortCriteria) {
        case 'finished':
          sorted = sorted.filter(todo => todo.completed);
          break;
        case 'notFinished':
          sorted = sorted.filter(todo => !todo.completed);
          break;
        case 'byid':
          // assuming todos are already sorted by id
          break;
        case 'random':
          sorted = sorted.sort(() => Math.random() - 0.5);
          break;
        case 'alphabet':
          sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          break;
      }

      if (searchTerm) {
        sorted = sorted.filter(todo => 
          todo.id.toString().includes(searchTerm) || 
          todo.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setTodosForDisplay(sorted);
    };

    sortAndFilterTodos();
  }, [sortCriteria, todos, searchTerm]); // Include searchTerm in dependency array

  // Handle change in sorting criteria
  const handleSortChange = (criterion) => {
    setSortCriteria(criterion);
  };

  // Handle change in search term
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Add a new todo
  const handleSubmitAddTodo = async (event) => {
    event.preventDefault();
    if (!newTodoTitle) return;

    try {
      // Fetch todos to get the current length for new todo id
      const response = await fetch(`http://localhost:3000/todos`);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const todosData = await response.json();

      let id=todosData.length > 0?
      parseInt(todosData[todosData.length - 1].id) + 1
      :1;
      id = id.toString();
    
      

      const newTodo = {
        userId: currentUser.id,
        id: id,
        title: newTodoTitle,
        completed: false
      };

      // Add new todo to backend
      const res = await fetch("http://localhost:3000/todos", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo)
      });

      if (!res.ok) {
        throw new Error('Failed to add todo');
      }

      // Update todos and todosForDisplay state after successful add
      setTodos([...todos, newTodo]);
      setTodosForDisplay([...todosForDisplay, newTodo]);

      // Clear input field after adding todo
      setNewTodoTitle('');

    } catch (err) {
      console.log(err);
    }
  };

  // Delete a todo by its id
  const handleDeleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE"
      });
      
      if (!res.ok) {
        console.log(res);
        throw new Error('Failed to delete todo');
      }

      // Update todos and todosForDisplay state after successful delete
      const updatedTodos = todos.filter(todo => todo.id !== id);
      setTodos(updatedTodos);
      setTodosForDisplay(updatedTodos);

    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  // Handle checkbox change to update completed status
  const handleCheckboxChange = async (id, completed) => {
    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed })
      });

      if (!res.ok) {
        throw new Error('Failed to update todo');
      }

      // Update todos and todosForDisplay state after successful update
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      );
      setTodos(updatedTodos);
      setTodosForDisplay(updatedTodos);

    } catch (err) {
      console.error('Error updating todo:', err);
    }
  };

  // Handle title edit
  const handleTitleEdit = async (id, newTitle) => {
    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title: newTitle })
      });

      if (!res.ok) {
        throw new Error('Failed to update todo title');
      }

      // Update todos and todosForDisplay state after successful update
      const updatedTodos = todos.map(todo =>
        todo.id === id ? { ...todo, title: newTitle } : todo
      );
      setTodos(updatedTodos);
      setTodosForDisplay(updatedTodos);

    } catch (err) {
      console.error('Error updating todo title:', err);
    }
  };

  const handleTitleChange = (id, event) => {
    const newTitle = event.target.value;
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, title: newTitle } : todo
    );
    setTodos(updatedTodos);
    setTodosForDisplay(updatedTodos);
  };

  const handleTitleBlur = (id, title) => {
    handleTitleEdit(id, title);
  };



  return (
    <div className={classes['container']}>
      <h1>User Todos</h1>
      <div className={classes['sort-container']}>
        <button className={classes['sort-button']}>Sort By</button>
        <div className={classes['dropdown-content']}>
          <a href="#" onClick={() => handleSortChange('finished')}>Finished</a>
          <a href="#" onClick={() => handleSortChange('notFinished')}>Not Finished</a>
          <a href="#" onClick={() => handleSortChange('byid')}>By ID</a>
          <a href="#" onClick={() => handleSortChange('random')}>Random</a>
          <a href="#" onClick={() => handleSortChange('alphabet')}>Alphabet</a>
        </div>
      </div>

      <div className={classes['search-container']}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by ID or title"
        />
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
            <input
              type="text"
              className={classes['todo-title']}
              value={todo.title}
              onChange={(event) => handleTitleChange(todo.id, event)}
              onBlur={() => handleTitleBlur(todo.id, todo.title)}
            />
            <input
              type="checkbox"
              checked={todo.completed}
              className={classes['todo-checkbox']}
              onChange={() => handleCheckboxChange(todo.id, todo.completed)}
            />
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;
