// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Starluck Tours</h1>
      <Link to="/tours">Browse Tours</Link>
    </div>
  );
}

export default Home;
