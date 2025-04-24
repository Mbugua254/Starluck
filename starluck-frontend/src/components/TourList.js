import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TourList.css';

const TourList = () => {
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tours')
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

  return (
    <div className="tour-list-container">
      <h2 className="tour-list-heading">Explore Our Tours</h2>
      <div className="destination-grid">
        {tours.map(tour => (
          <div key={tour.id} className="destination-card">
            <h3 className="tour-name">{tour.name}</h3>
            <p className="tour-description">{tour.description.slice(0, 100)}...</p>
            <p className="tour-price">${tour.price}</p>
            <button onClick={() => handleViewDetails(tour.id)} className="view-details-btn">
              View Details →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourList;
