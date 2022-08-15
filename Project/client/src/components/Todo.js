import React from 'react';

const Todo = ({ todo }) => {
    return (
      <li>{todo.content}, {todo.done.toString()}, {todo.id}</li>
    )
  }
  
  export default Todo