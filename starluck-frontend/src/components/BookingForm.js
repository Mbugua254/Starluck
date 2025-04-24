import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookingForm.css';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Pending');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [userId, setUserId] = useState(null); // This should be retrieved from the Auth context or login state.

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
      status,
      payment_status: paymentStatus,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/bookings', bookingData);
      alert('Booking created successfully!');
      navigate(`/user-dashboard`);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking.');
    }
  };
  return (
    <div>
      <h2>Book Tour</h2>
      <form onSubmit={handleSubmit} className='book-form'>
        <div className='book-div'>
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
