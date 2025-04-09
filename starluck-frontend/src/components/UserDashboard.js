// src/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null); // Placeholder for logged-in user details
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Here, we assume the logged-in user has an ID of 1 for demo purposes
    const userId = 1;

    // Fetch user's bookings
    axios
      .get(`http://127.0.0.1:5000/users/${userId}/bookings`)
      .then((response) => {
        setBookings(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bookings:', error);
      });

    // Fetch user's reviews
    axios
      .get(`http://127.0.0.1:5000/users/${userId}/reviews`)
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error('Error fetching reviews:', error);
      });

    // Fetch logged-in user's info (or retrieve it from context)
    setUser({ id: userId, name: 'John Doe' }); // Example user info
  }, []);

  return (
    <div>
      <h2>{user ? `${user.name}'s Dashboard` : 'Loading...'}</h2>

      <h3>Your Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            Tour ID: {booking.tour_id} | Status: {booking.status} | Payment: {booking.payment_status}
          </li>
        ))}
      </ul>

      <h3>Your Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            Tour ID: {review.tour_id} | Rating: {review.rating} | Review: {review.review_text}
          </li>
        ))}
      </ul>

      <Link to="/tours">Back to Tours</Link>
    </div>
  );
};

export default UserDashboard;
