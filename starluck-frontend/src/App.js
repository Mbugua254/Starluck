import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import TourList from './components/TourList';
import TourDetail from './components/TourDetail';
import BookingForm from './components/BookingForm';
import ReviewForm from './components/ReviewForm';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';

const App = () => {
  return (
    <AuthProvider>
    <Router>
    <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/tours" element={<TourList />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/booking/:tourId" element={<BookingForm />} />
        <Route path="/review/:tourId" element={<ReviewForm />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
