// src/components/ReviewForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewForm.css';

const ReviewForm = ({ tourId, userId, reviewId = null, existingReview = null }) => {
  const [rating, setRating] = useState(existingReview ? existingReview.rating : 0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview ? existingReview.review_text : '');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setReviewText(existingReview.review_text);
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reviewData = {
      user_id: userId,
      tour_id: tourId,
      rating,
      review_text: reviewText,
    };

    try {
      if (reviewId) {
        // Update existing review
        await axios.put(`http://127.0.0.1:5000/reviews/${reviewId}`, reviewData);
        alert('Review updated successfully!');
      } else {
        // Create new review
        await axios.post('http://127.0.0.1:5000/reviews', reviewData);
        alert('Review created successfully!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://127.0.0.1:5000/reviews/${reviewId}`);
        alert('Review deleted successfully!');
        // Optionally, redirect or update UI after deletion
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rating-stars">
        <label>Rating:</label>
        <div className="stars">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <span
                key={index}
                className={`star ${starValue <= (hover || rating) ? 'filled' : ''}`}
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              >
                &#9733;
              </span>
            );
          })}
        </div>
      </div>

      <div>
        <label>Review:</label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="book-btn">{reviewId ? 'Update Review' : 'Submit Review'}</button>

      {reviewId && (
        <button type="button" className="delete-btn" onClick={handleDelete}>
          Delete Review
        </button>
      )}
    </form>
  );
};

export default ReviewForm;
