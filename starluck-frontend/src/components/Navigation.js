import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/tours" className={({ isActive }) => (isActive ? 'active' : '')}>
            Tours
          </NavLink>
        </li>
        {!user ? (
          <>
            <li>
              <NavLink to="/register" className={({ isActive }) => (isActive ? 'active' : '')}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({ isActive }) => (isActive ? 'active' : '')}>
                Login
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/user-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                Dashboard
              </NavLink>
            </li>
            <li>
  <NavLink
    to="/"
    onClick={handleLogout}
    className={({ isActive }) => (isActive ? 'active' : '')}
  >
    Logout
  </NavLink>
</li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
