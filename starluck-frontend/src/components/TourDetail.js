// src/components/TourDetail.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    const fetchTour = async () => {
      const response = await axios.get(`http://127.0.0.1:5000/tours/${id}`);
      setTour(response.data);
    };

    fetchTour();
  }, [id]);

  if (!tour) return <div>Loading...</div>;

  return (
    <div>
      <h2>{tour.name}</h2>
      <p>{tour.description}</p>
      <p>Price: ${tour.price}</p>
      {/* Link to booking page */}
      <Link to={`/bookings/${tour.id}`}>Book this tour</Link>
    </div>
  );
};

export default TourDetail;
