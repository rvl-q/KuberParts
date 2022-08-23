import { useState, useEffect } from 'react'
import Todo from './Todo'
import axios from 'axios'

export const TODO_BACKEND_URL = "http://localhost:8081/todos";
  const TODO_IMAGE_URL = "http://localhost:8081/images/image.jpg";
  const TODO_BACKEND_PATH = "/todos";
  const TODO_IMAGE_PATH = "/images/image.jpg";
  const host = location.origin;
  // const TODO_BACKEND_URL = "http://localhost:9999/todos";
  // const TODO_IMAGE_URL = "http://localhost:8081/images/image.jpg";
//   const TODO_BACKEND_URL = host + TODO_BACKEND_PATH;
//   const TODO_IMAGE_URL = host + TODO_IMAGE_PATH;
  // const [showAll, setShowAll] = useState(true)


  const Page = () => {
    const [todos, setTodos] = useState([])
    const [newTodo, setNewTodo] = useState('') 
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

  return(
  <div>
  <h1>Todos!</h1>
    <h2>Exercise 4.08: Project v2.1</h2>
      <img className='App-displayed'  src={TODO_IMAGE_URL} alt='daily pic'/>
      <p></p>
      <form onSubmit={addTodo}>
        <input
          value={newTodo}
          onChange={handleTodoChange}
        />
        <button type="submit">Create TODO!</button>
      </form>
      <div className="App-todolist">
      <ul>
        {todos.map(todo => 
          <Todo key={todo.id} todo={todo} />
        )}
      </ul>
      </div>
  </div>
  )
}
export default Page