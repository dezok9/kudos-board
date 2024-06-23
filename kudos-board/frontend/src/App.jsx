import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Cards from './pages/Cards';


import './App.css';

function App() {
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board/:id" element={<Cards />} />
      </Routes>
    </Router>
    </>
  )
}

export default App;
