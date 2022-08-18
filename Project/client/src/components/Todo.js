// import React from 'react';
import React, { useState, useEffect } from 'react'
import axios from 'axios'

// const TODO_BACKEND_URL = "http://localhost:8081/todos";
import { TODO_BACKEND_URL } from './Page';

const handleDone = async (id) => {
  try{
    const { data } = await axios.put(`${TODO_BACKEND_URL}/${id}`)
    console.log('put for id:',id)
  } catch(err) {
    console.log('not yet... @id', id)
  }
}

const Todo = ({ todo }) => {
    console.log(todo.done.toString())
    return (
      <li>{todo.content} &emsp; {todo.done === false ? <span>
      <button onClick={() => handleDone(todo.id)} >Mark as done!</button></span>: <span>Done</span>}
      </li>
    )
  }
  
export default Todo