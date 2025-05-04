import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import ReviewForm from './ReviewForm';
import './TourDetail.css';

const TourDetail = () => {
  const { id: tourId } = useParams();
  const [tour, setTour] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    if (!userData) return;
    setUser(userData);

    axios.get(`https://starluck.onrender.com/tours/${tourId}`)
      .then((res) => setTour(res.data))
      .catch((err) => console.error('Error fetching tour:', err));

    axios.get(`https://starluck.onrender.com/tours/${tourId}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error('Error fetching reviews:', err));
  }, [tourId]);

  const handleReviewAction = (action, reviewData) => {
    if (action === 'create') {
      setReviews((prevReviews) => [...prevReviews, reviewData]);
    } else if (action === 'update') {
      setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === reviewData.id ? reviewData : review))
      );
    } else if (action === 'delete') {
      setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewData));
    }
  };

  const handleReviewSubmit = (review, isEdit = false) => {
    if (isEdit) {
      axios.put(`https://starluck.onrender.com/reviews/${review.id}`, review)
        .then((res) => {
          setReviews((prev) => prev.map((r) => (r.id === review.id ? res.data : r)));
          setEditingReview(null);
          alert('Review updated!');
        })
        .catch((err) => {
          console.error('Error updating review:', err);
          alert('Could not update review.');
        });
    } else {
      axios.post('https://starluck.onrender.com/reviews', review)
        .then((res) => {
          setReviews((prev) => [...prev, res.data]);
          alert('Review created!');
        })
        .catch((err) => {
          console.error('Error creating review:', err);
          alert('Could not create review.');
        });
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      axios.delete(`https://starluck.onrender.com/reviews/${reviewId}`)
        .then(() => {
          setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
          alert('Review deleted successfully!');
        })
        .catch((err) => {
          console.error('Error deleting review:', err);
          alert('Failed to delete review.');
        });
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (!tour || !user) return <div className="tour-loading">Loading tour details...</div>;

  return (
    <div className="tour-container">
      <div className="tour-card">
        <h2 className="tour-title">{tour.name}</h2>
        <p className="tour-description">{tour.description}</p>
        <p className="tour-price"><strong>Price:</strong> ${tour.price}</p>
        <p className="tour-average-rating"><strong>Average Rating:</strong> {calculateAverageRating()} / 5</p>
        <Link to={`/bookings/${tour.id}`} className="tour-book-btn">Book This Tour</Link>
      </div>

      <div className="tour-review-form">
        <ReviewForm
          tourId={tour.id}
          userId={user.id}
          reviewId={editingReview ? editingReview.id : null}
          existingReview={editingReview}
          onReviewAction={handleReviewAction}
        />
      </div>

      <div className="tour-reviews">
        <h3 className="reviews-title">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet.</p>
        ) : (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
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
              
                {review.user && review.user_id === user.id && (
                  <div className="review-actions">
                    <button onClick={() => handleEditReview(review)}>Edit</button>
                    <button onClick={() => handleDeleteReview(review.id)}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </ul>
        )}
      </div>

      <Link to="/tours" className="back-link">← Back to All Tours</Link>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Starluck Tours. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default TourDetail;
