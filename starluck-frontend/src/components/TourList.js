import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TourList.css';


const TourList = () => {
  const [tours, setTours] = useState([]);
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [reviews, setReviews] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://starluck.onrender.com/tours')
      .then(response => {
        setTours(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleViewDetails = (tourId) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please register or login to view tour details.');
      navigate('/register');
    } else {
      navigate(`/tours/${tourId}`);
    }
  };

  const handleLocationChange = (e) => {
    setLocationFilter(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const filteredTours = tours.filter((tour) => {
    const locationMatch = locationFilter
      ? tour.location?.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const priceMatch = priceFilter
      ? parseFloat(tour.price) <= parseFloat(priceFilter)
      : true;
    return locationMatch && priceMatch;
  });

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  


  return (
    <div className="tour-list-container">
      <h2 className="tour-list-heading">Explore Our Tours</h2>

      {/* Filter Controls */}
      <div className="filter-controls">
        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={handleLocationChange}
          className="filter-input"
        />
        <input
          type="number"
          placeholder="Max price"
          value={priceFilter}
          onChange={handlePriceChange}
          className="filter-input"
        />
      </div>

      <div className="destination-grid">
        {filteredTours.length > 0 ? (
          filteredTours.map(tour => (
            <div key={tour.id} className="destination-card">
              <img src={tour.image_url} alt={tour.name} className="tour-image" />
              <h3 className="tour-name">{tour.name}</h3>
              <p className="tour-description">{tour.description.slice(0, 100)}...</p>
              <p className="tour-price">${tour.price}</p>
              <p className="tour-average-rating"><strong>Rating:</strong> {calculateAverageRating()}</p>
              <button onClick={() => handleViewDetails(tour.id)} className="view-details-btn">
                View Details →
              </button>
            </div>
          ))
        ) : (
          <p className="no-results-message">No tours match your filters.</p>
        )}
      </div>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Starluck Tours. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default TourList;
