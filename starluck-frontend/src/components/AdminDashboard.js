import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Import the CSS file

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('users');
  //const [newTour, setNewTour] = useState({ name: '', description: '', price: '' });
  //const [editingTour, setEditingTour] = useState(null);

  const token = localStorage.getItem('token');

  const renderStars = (rating) => {
    const totalStars = 5;
    let stars = '';
    for (let i = 0; i < totalStars; i++) {
      stars += i < rating ? '⭐' : '☆';
    }
    return stars;
  };

  const [editingTourId, setEditingTourId] = useState(null);
  const [editTourData, setEditTourData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    image: null
});

const [newTourData, setNewTourData] = useState({
  name: '',
  description: '',
  price: '',
  location: '',
  image: null
});




  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [userRes, bookingRes, reviewRes, tourRes] = await Promise.all([
          axios.get('https://starlucktours.onrender.com/users', { headers }),
          axios.get('https://starlucktours.onrender.com/bookings', { headers }),
          axios.get('https://starlucktours.onrender.com/reviews', { headers }),
          axios.get('https://starlucktours.onrender.com/tours', { headers }),
        ]);

        setUsers(userRes.data);
        setBookings(bookingRes.data);
        setReviews(reviewRes.data);
        setTours(tourRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error.response || error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const confirmBooking = async (bookingId) => {
    try {
      await axios.patch(`https://starlucktours.onrender.com/bookings/${bookingId}/confirm`, { status: 'confirmed' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update the state to reflect the confirmation without re-fetching all bookings
      setBookings(prevBookings =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'confirmed' } : booking
        )
      );
    } catch (error) {
      console.error('Error confirming booking:', error.response || error.message);
    }
  };
  const cancelBooking = async (bookingId) => {
    try {
      await axios.patch(`https://starlucktours.onrender.com/bookings/${bookingId}/cancel`, { status: 'cancelled' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Update the local state
      setBookings(prevBookings =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
    } catch (error) {
      console.error('Error cancelling booking:', error.response || error.message);
    }
  };

  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="side-menu">
        <h2>Admin Menu</h2>
        <ul>
          <li onClick={() => setSelectedTab('users')}>Users</li>
          <li onClick={() => setSelectedTab('bookings')}>Bookings</li>
          <li onClick={() => setSelectedTab('reviews')}>Reviews</li>
          <li onClick={() => setSelectedTab('tours')}>Tours</li>
          <li onClick={() => setSelectedTab('addTour')}>Add New Tour</li>
        </ul>
      </div>

      <div className="main-content">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        {selectedTab === 'users' && (
          <section className="dashboard-card">
            <h2>Users</h2>
            <ul>
              {users.length > 0 ? (
                users.map((user) => (
                  <li key={user.id}>{user.username} - {user.email}</li>
                ))
              ) : (
                <li>No users available</li>
              )}
            </ul>
          </section>
        )}

        {selectedTab === 'bookings' && (
          <section className="dashboard-card">
            <h2>Bookings</h2>
            <ul>
              {bookings.length > 0 ? (
                bookings.map((booking) => {
                  const user = users.find((u) => u.id === booking.user_id);
                  return (
                    <li key={booking.id}>
                      <strong>User:</strong> {user?.username || 'Unknown'} ({user?.email || 'N/A'})<br />
                      <strong>Tour ID:</strong> {booking.tour_id}<br />
                      <strong>Status:</strong> {booking.status}
                      {booking.status !== 'confirmed' && (
                        <button onClick={() => confirmBooking(booking.id)} style={{ marginLeft: '10px' }}>
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                <button onClick={() => cancelBooking(booking.id)} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                  Cancel
                </button>
              )}
                    </li>
                  );
                })
              ) : (
                <li>No bookings available</li>
              )}
            </ul>
          </section>
        )}

        {selectedTab === 'reviews' && (
          <section className="dashboard-card">
            <h2>Reviews</h2>
            <ul>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <li key={review.id}>
                    {review.username}: "{review.review_text}" - {renderStars(review.rating)}
                  </li>
                ))
              ) : (
                <li>No reviews available</li>
              )}
            </ul>
          </section>
        )}

        {selectedTab === 'tours' && (
          <section className="dashboard-card">
            <h2>Tours</h2>
            <ul>
  {tours.length > 0 ? (
    tours.map((tour) => (
      <li key={tour.id}>
        {editingTourId === tour.id ? (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.put(
                  `https://starlucktours.onrender.com/tours/${tour.id}`,
                  editTourData,
                  { headers }
                );
                setTours(tours.map(t => (t.id === tour.id ? response.data : t)));
                setEditingTourId(null);
              } catch (error) {
                console.error('Error updating tour:', error);
              }
            }}
          >
            <input
              type="text"
              value={editTourData.name}
              onChange={(e) => setEditTourData({ ...editTourData, name: e.target.value })}
              required
            />
            <input
              type="text"
              value={editTourData.description}
              onChange={(e) => setEditTourData({ ...editTourData, description: e.target.value })}
              required
            />
            <input
              type="number"
              value={editTourData.price}
              onChange={(e) => setEditTourData({ ...editTourData, price: e.target.value })}
              required
            />
            <input
              type="text"
              value={editTourData.location}
              onChange={(e) => setEditTourData({ ...editTourData, location: e.target.value })}
              required
            />
            <input
            type="file"
            onChange={(e) =>
              setEditTourData({ ...editTourData, image: e.target.files[0] })
              }
              />

            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingTourId(null)}>Cancel</button>
          </form>
        ) : (
          <>
            <strong>{tour.name}</strong> - {tour.location} - ${tour.price}<br />
            <em>{tour.description}</em><br />
            <br />
            <img src={tour.image_url} alt={tour.name} style={{ maxWidth: '150px' }} />
            <br />
            <button
              onClick={() => {
                setEditTourData({
                  name: tour.name,
                  description: tour.description,
                  price: tour.price,
                  location: tour.location,
                  image:null,
                  
                });
                setEditingTourId(tour.id);
              }}
            >
              Edit
            </button>
            <button
              onClick={async () => {
                try {
                  const headers = { Authorization: `Bearer ${token}` };
                  await axios.delete(`https://starlucktours.onrender.com/tours/${tour.id}`, { headers });
                  setTours(tours.filter(t => t.id !== tour.id));
                } catch (error) {
                  console.error('Error deleting tour:', error);
                }
              }}
              style={{ color: 'red', marginLeft: '0.5rem' }}
            >
              Delete
            </button>
          </>
        )}
      </li>
    ))
  ) : (
    <li>No tours available</li>
  )}
</ul>
</section>
)}
{selectedTab === 'addTour' && (
  <section className="dashboard-card">
    <h2>Add New Tour</h2>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const formData = new FormData();
          formData.append('name', newTourData.name);
          formData.append('description', newTourData.description);
          formData.append('price', newTourData.price);
          formData.append('location', newTourData.location);
          if (newTourData.image) {
            formData.append('image', newTourData.image);
          }

          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          };

          const response = await axios.post('https://starlucktours.onrender.com/tours', formData, { headers });
          setTours([...tours, response.data]);
          setNewTourData({ name: '', description: '', price: '', location: '', image: null });
          setSelectedTab('tours');
        } catch (error) {
          console.error('Error creating tour:', error.response || error.message);
        }
      }}
      encType="multipart/form-data"
    >
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newTourData.name}
        onChange={(e) => setNewTourData({ ...newTourData, name: e.target.value })}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newTourData.description}
        onChange={(e) => setNewTourData({ ...newTourData, description: e.target.value })}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={newTourData.price}
        onChange={(e) => setNewTourData({ ...newTourData, price: e.target.value })}
        required
      />
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={newTourData.location}
        onChange={(e) => setNewTourData({ ...newTourData, location: e.target.value })}
        required
      />
      
      <input type="file" 
      name="image" 
      accept="image/*"
      onChange={(e) => setNewTourData({ ...newTourData, image: e.target.files[0] })}
      />
      
      <button type="submit">Add Tour</button>
    </form>
  </section>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
