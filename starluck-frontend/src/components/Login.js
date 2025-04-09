// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email,
        password
      });

      if (response.data.success) {
        setUser(response.data.user);  // Assuming the user object is returned
        history.push('/dashboard');  // Redirect to Dashboard after successful login
      } else {
        setErrorMessage(response.data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('An error occurred while logging in.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
