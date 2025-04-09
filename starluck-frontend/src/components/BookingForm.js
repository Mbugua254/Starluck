// src/components/BookingForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingForm = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Pending');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [userId, setUserId] = useState(null); // This should be retrieved from the Auth context or login state.

  useEffect(() => {
    // Ideally, you'd retrieve the userId from a context or state that holds the logged-in user.
    // Here, we're just using a placeholder value for demonstration.
    setUserId(1); // Example: Logged-in user ID
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      user_id: userId,
      tour_id: tourId,
      status,
      payment_status: paymentStatus,
    };

    axios
      .post('http://127.0.0.1:5000/bookings', bookingData)
      .then((response) => {
        alert('Booking created successfully!');
        navigate(`/user-dashboard`);
      })
      .catch((error) => {
        console.error('Error creating booking:', error);
        alert('Failed to create booking.');
      });
  };

  return (
    <div>
      <h2>Book Tour</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label>Payment Status</label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
          >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <button type="submit">Book Tour</button>
      </form>
    </div>
  );
};

export default BookingForm;
