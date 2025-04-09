// src/components/ReviewForm.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReviewForm = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(5); // Default rating is 5
  const [reviewText, setReviewText] = useState('');
  const [userId, setUserId] = useState(null); // User ID should come from auth context

  useEffect(() => {
    // Retrieve the userId from context or login state
    setUserId(1); // Placeholder for demo purposes
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      user_id: userId,
      tour_id: tourId,
      rating,
      review_text: reviewText,
    };

    axios
      .post('http://localhost:5000/reviews', reviewData)
      .then((response) => {
        alert('Review submitted successfully!');
        navigate(`/tours/${tourId}`);
      })
      .catch((error) => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review.');
      });
  };

  return (
    <div>
      <h2>Leave a Review</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating</label>
          <input
            type="number"
            value={rating}
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div>
          <label>Review</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows="4"
          ></textarea>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
