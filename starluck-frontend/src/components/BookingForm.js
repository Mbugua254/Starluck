import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const bookingData = {
      user_id: userId,
      tour_id: id,
      status: 'pending',
      payment_status: 'pending',
    };

    try {
      await axios.post('http://127.0.0.1:5000/bookings', bookingData);
      alert('Booking created! Await agent confirmation.');
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking.');
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Tour</h2>
      <form onSubmit={handleSubmit} className="book-form">
        <p>
          Once booked, your status will show as <strong>Pending</strong> until confirmed by the tour agent.
        </p>
        <button type="submit" className="book-button">Book Tour</button>
      </form>
    </div>
  );
};

export default BookingForm;
