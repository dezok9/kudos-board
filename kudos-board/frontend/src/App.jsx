import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Desk from './pages/Desk';
import BoardCards from './pages/BoardCards';


import './App.css';

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element=
        {<Desk />} />
        <Route path="/board/:id" element={<BoardCards />} />
      </Routes>
    </Router>
    </>
  )
}

export default App;
