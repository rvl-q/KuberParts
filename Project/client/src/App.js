import React from 'react';

import { useState, useEffect } from 'react'
import Todo from './components/Todo'

import './App.css';

import axios from 'axios'

import { Routes, Route } from 'react-router-dom'

const App = () => {

  // const TODO_BACKEND_URL = "http://localhost:8081/todos";
  // const TODO_IMAGE_URL = "http://localhost:8081/images/image.jpg";
  const TODO_BACKEND_PATH = "/todos";
  const TODO_IMAGE_PATH = "/images/image.jpg";
  const host = location.origin;
  // const TODO_BACKEND_URL = "http://localhost:9999/todos";
  // const TODO_IMAGE_URL = "http://localhost:8081/images/image.jpg";
  const TODO_BACKEND_URL = host + TODO_BACKEND_PATH;
  const TODO_IMAGE_URL = host + TODO_IMAGE_PATH;

  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('') 
  // const [showAll, setShowAll] = useState(true)

  useEffect(() => {
    console.log('effect')
    axios
      .get(TODO_BACKEND_URL)
      .then(response => {
        console.log('promise fulfilled')
        setTodos(response.data)
      })
  }, [])
  console.log('render', todos.length, 'todos')

  const addTodo = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const todoObject = {
      content: newTodo,
      // date: new Date().toISOString(),
      // important: Math.random() > 0.5,
      // id: (todos && (todos.length + 1)) || 1,
      done: false,
      id: 0,
    }

    console.log('todo object:', todoObject)
    axios
    .post(TODO_BACKEND_URL, todoObject)
    .then(response => {
      setTodos(todos.concat(response.data))
      setNewTodo('')
    })

  }

  const handleTodoChange = (event) => {
    console.log(event.target.value)
    setNewTodo(event.target.value)
  }
 
  // http://localhost:8081/images/image.jpg
  return (
    <Routes>
        <Route path="/" element={
        <div>
          <h1>Todos!</h1>
            <h2>Exercise 4.02: Project v1.7</h2>
              <img className='App-displayed'  src={TODO_IMAGE_URL} alt='daily pic'/>
              <p></p>
              <form onSubmit={addTodo}>
                <input
                  value={newTodo}
                  onChange={handleTodoChange}
                />
                <button type="submit">Create TODO!</button>
              </form>
              <ul>
                {todos.map(todo => 
                  <Todo key={todo.id} todo={todo} />
                )}
              </ul>
        </div>
        } />
        <Route path="/healthz" element={<h1>Exercise 4.02: Project v1.7 healthz test</h1>} />
    </Routes>
  ) // test
}

export default App