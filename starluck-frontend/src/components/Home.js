// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
const Home = () => {
  return (
    <div>
      <h1>Welcome to Starluck Tours</h1>
      <Link to="/tours" className='browse-link'>Browse Tours</Link>
    </div>
  );
}

export default Home;
