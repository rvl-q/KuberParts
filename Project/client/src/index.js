import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'

console.log('Todos starting index...')

// ReactDOM.createRoot(document.getElementById('root')).render(<App />)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback="loading...">
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Suspense>
)
