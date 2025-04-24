// src/components/TourDetail.js
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import './TourDetail.css';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;

    if (!userData) return;

    setUser(userData);

    axios
      .get(`http://127.0.0.1:5000/tours/${id}`)
      .then((res) => setTour(res.data))
      .catch((err) => console.error('Error fetching tour:', err));

    axios
      .get(`http://127.0.0.1:5000/tours/${id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [id]);

  if (!tour || !user) return <div className="tour-loading">Loading tour details...</div>;

  return (
    <div className="tour-container">
      <div className="tour-card">
        <h2 className="tour-title">{tour.name}</h2>
        <p className="tour-description">{tour.description}</p>
        <p className="tour-price"><strong>Price:</strong> ${tour.price}</p>
        <Link to={`/bookings/${tour.id}`} className="tour-book-btn">Book This Tour</Link>
      </div>

      <div className="tour-review-form">
        <ReviewForm tourId={tour.id} userId={user.id} />
      </div>

      <div className="tour-reviews">
        <h3 className="reviews-title">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet.</p>
        ) : (
          <ul className="reviews-list">
  {reviews.map((review, index) => (
    <div key={index} className="review-card">
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
  ))}
</ul>

        )}
      </div>

      <Link to="/tours" className="back-link">← Back to All Tours</Link>
    </div>
  );
};

export default TourDetail;
