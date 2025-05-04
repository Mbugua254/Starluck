// src/components/UserDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (!userData) return;

    setUser({ id: userData.id, name: userData.username });

    axios
      .get(`https://starlucktours.onrender.com/users/${userData.id}/bookings`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Error fetching bookings:', err));

    axios
      .get(`https://starlucktours.onrender.com/users/${userData.id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, []);


  if (!user) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">{user.name}'s Dashboard</h2>

      <section className="dashboard-section">
        <h3>Your Bookings</h3>
        {bookings.length === 0 ? (
          <p className="dashboard-empty">No bookings found.</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <li key={booking.id} className="dashboard-item">
                <span><strong>Tour ID:</strong> {booking.tour_id}</span>
                <span><strong>Status:</strong> {booking.status}</span>
                
              </li>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
  <h3>Your Reviews</h3>
  {reviews.length === 0 ? (
    <p className="dashboard-empty">No reviews yet.</p>
  ) : (
    <div className="reviews-grid">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <span className="review-tour">
            <strong>Tour:</strong> {review.tour?.name || review.tour_id}
          </span>

          <div className="stars-and-text">
            <div className="stars-display">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star ${i < review.rating ? 'filled' : ''}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <p className="review-text">{review.review_text}</p>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

      <Link to="/tours" className="dashboard-link">← Back to Tours</Link>
    </div>
  );
};

export default UserDashboard;
