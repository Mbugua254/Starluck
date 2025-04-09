import React from 'react';
import { NavLink } from 'react-router-dom';  // Use NavLink for active link functionality
import './Navigation.css';  // Optional: CSS for styling

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" exact activeClassName="active">Home</NavLink>
        </li>
        <li>
          <NavLink to="/tours">Tours</NavLink>  {/* Link to Tours page */}
        </li>
        <li>
          <NavLink to="/about" activeClassName="active">About</NavLink>
        </li>
        <li>
          <NavLink to="/services" activeClassName="active">Services</NavLink>
        </li>
        <li>
          <NavLink to="/contact" activeClassName="active">Contact</NavLink>
        </li>
        <li>
          <NavLink to="/login" activeClassName="active">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
