import React from 'react';
import './RecentReview.css';

// Function to convert timestamp to a readable date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

const RecentReview = ({ review }) => {
  const { username, review_text, rating, created_at } = review;

  // Function to generate star icons
  const generateStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<span key={i} className="star">★</span>);
    }
    return stars;
  };

  return (
    <div className="recent-review">
      <h3>{username}</h3>
      <div className="stars">
        {generateStars(rating)}
      </div>
      <p>{review_text}</p>
      <p><strong>Posted on: </strong>{formatDate(created_at)}</p>
    </div>
  );
};

export default RecentReview;
