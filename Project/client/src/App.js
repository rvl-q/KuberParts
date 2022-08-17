import React from 'react';

import { useState, useEffect } from 'react'
// import Todo from './components/Todo'

import './App.css';

// import axios from 'axios'

import { Routes, Route } from 'react-router-dom'
import Health from './components/Health';
import Page from './components/Page';

const App = () => {

  // http://localhost:8081/images/image.jpg
  return (
    <div className="App">
    <Routes>
        <Route path="/" element={ <Page />} />
        <Route path="/healthz" element={ <Health />} />
    </Routes>
    </div>
  ) // test
}

export default App