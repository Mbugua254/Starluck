import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import RecentReview from './RecentReview';
import Paris from '../assets/Paris.jpg';
import Safaris from '../assets/Safaris.jpg';
import Bali from '../assets/Bali.jpg';


const Home = () => {
  const [recentReview, setRecentReview] = useState(null);

  useEffect(() => {
    // Fetch the most recent 5-star review
    axios
      .get('http://127.0.0.1:5000/reviews/recent/5star')
      .then((res) => {
        console.log('Fetched recent 5-star review:', res.data);
        setRecentReview(res.data); // Set the state with the fetched review
      })
      .catch((err) => {
        console.error('Error fetching review:', err);
      });
  }, []);


  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Explore the World with Starluck Tours</h1>
        <p>Your dream vacation is just a click away.</p>
        <Link to="/tours" className="btn-primary">Browse Tours</Link>
      </section>
      
      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          Starluck is your trusted partner in discovering unforgettable travel experiences.
          Whether you're looking for adventure, relaxation, or cultural immersion, we've got the perfect tour for you.
        </p>
      </section>

      {/* Popular Tours */}
      <section className="popular-tours">
        <h2>Popular Tours</h2>
        <div className="tour-cards">
          <div className="card">
            <img src={Paris} alt="Paris" style={{ width: '300px', borderRadius: '10px' }} />
            <h3>Paris Getaway</h3>
            <p>5 Days in the City of Light</p>
          </div>
          <div className="card">
            <img src={Safaris} alt="Safari" style={{ width: '300px', borderRadius: '10px' }} />
            <h3>Kenya Safari</h3>
            <p>Wildlife adventures in the savannah</p>
          </div>
          <div className="card">
            <img src={Bali} alt="Beach" style={{ width: '300px', borderRadius: '10px' }} />
            <h3>Bali Beach Escape</h3>
            <p>Relax under the sun in paradise</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">1. Browse Tours</div>
          <div className="step">2. Choose Your Favorite</div>
          <div className="step">3. Book and Enjoy</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Travelers Say</h2>
        <div className="traveler-reviews">
          {/* Only show the review if it's fetched */}
          {recentReview ? (
            <RecentReview review={recentReview} />
          ) : (
            <p>No 5-star reviews yet.</p>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <h2>Ready for Your Next Adventure?</h2>
        <Link to="/tours" className="btn-secondary">Explore Tours</Link>
      </section>

      {/* Contact Section */}
<section className="contact">
  <h2>Contact Us</h2>
  <p>We’d love to hear from you. Fill out the form below and we’ll get back to you shortly.</p>
  <div className="contact-form">
    <input type="text" placeholder="Your Name" />
    <input type="email" placeholder="Your Email" />
    <textarea rows="5" placeholder="Your Message"></textarea>
    <button type="submit">Send Message</button>
  </div>
</section>


      {/* Footer */}
      <footer className="footer">
        <p>Email: info@starlucktravel.com</p>
        <p>Contact: 0769065557</p>
        <p>© {new Date().getFullYear()} Starluck Tours. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
