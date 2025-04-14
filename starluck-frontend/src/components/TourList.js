// src/components/TourList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './TourList.css';

const TourList = () => {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/tours')
      .then(response => {
        console.log(response.data);
        setTours(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h2>Our Tours</h2>
      <div className="destination-grid">
      <ul>
        {tours.map(tour => (
          <div key={tour.id} className="destination-card">
            <Link to={`/tours/${tour.id}`}>{tour.name}</Link>
          </div>
        ))}
      </ul>
      </div>
    </div>
  );
}

export default TourList;
