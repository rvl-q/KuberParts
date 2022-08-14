import React from 'react';

const Todo = ({ todo }) => {
    return (
      <li>{todo.content}, {todo.done}, {todo.id}</li>
    )
  }
  
  export default Todo