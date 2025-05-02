import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navigation.css';
import { FaFacebookF, FaInstagram, FaTiktok, FaTwitter } from 'react-icons/fa';
import Logo from '../assets/Logo.gif'; // Add your logo to /assets and import it

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <NavLink to="/">
          <img src={Logo} alt="Starluck Tours Logo" />
        </NavLink>
      </div>
      <div className='nav-content'>
      {/*<div className='contdetails'>
      <p>info@starlucktravel.com</p>
      <p>+254 769 065 557</p>
      </div>*/}

      {/* Navigation Links */}
      <ul className="nav-links">
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
            {user.role === 'admin' ? (
              <li>
                <NavLink to="/admin-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Admin Dashboard
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/user-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Dashboard
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to="/" onClick={handleLogout}>
                Logout
              </NavLink>
            </li>
          </>
        )}
      </ul>
      </div>
      

      {/* Social Media Icons */}
      <div className="social-icons">
        <a href="https://www.facebook.com/starlucktrv/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
        <a href="https://www.instagram.com/starluck_travel/" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        <a href="https://www.tiktok.com/@starlucktravelke?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer"><FaTiktok /></a>
      </div>
    </nav>
  );
};

export default Navigation;
