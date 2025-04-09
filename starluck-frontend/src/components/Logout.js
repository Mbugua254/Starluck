// src/components/Logout.js
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const Logout = ({ setUser }) => {
  const history = useHistory();

  useEffect(() => {
    // Clear user data from the state and localStorage/sessionStorage if needed
    setUser(null);
    history.push('/login'); // Redirect to login page after logging out
  }, [setUser, history]);

  return <div>Logging out...</div>;
};

export default Logout;
