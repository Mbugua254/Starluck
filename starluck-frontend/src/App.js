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
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

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
        <Route path="/bookings/:id" element={<BookingForm />} />
        <Route path="/tours/:id/review" element={<ReviewForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/*Restricted*/}
        <Route
        path='/tours/:id'
        element={
          <PrivateRoute>
            <TourDetail />
            </PrivateRoute>
        }
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
