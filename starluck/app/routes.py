from flask import Blueprint, request, jsonify
from app import db
from app.models import User, Tour, Booking, Review
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash  # Import this to check passwords
import jwt  # For JWT handling
from datetime import timedelta  # For token expiration time

bp = Blueprint('api', __name__)

# Secret key for encoding/decoding JWT (should be kept secret and secure)
SECRET_KEY = 'your_secret_key'

# Login route - authenticate user and generate JWT token
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    
    if user and check_password_hash(user.password_hash, password):
        # Create a JWT token for the authenticated user
        token = jwt.encode(
            {'user_id': user.id, 'exp': datetime.utcnow() + timedelta(hours=1)}, 
            SECRET_KEY, 
            algorithm='HS256'
        )
        
        return jsonify({
            'message': 'Login successful',
            'token': token
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

# Logout route - JWT tokens are client-side managed, but can handle invalidation on server if needed
@bp.route('/logout', methods=['POST'])
def logout():
    # As JWT is stateless, there’s no need to "destroy" it on the server.
    # But here you could remove the token from client storage or invalidate it if using server-side tracking.
    return jsonify({'message': 'Logged out successfully'}), 200
# Create a new booking
@bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json()
    user_id = data.get('user_id')
    tour_id = data.get('tour_id')
    booking_date = data.get('booking_date', str(datetime.now()))
    status = data.get('status', 'Pending')
    payment_status = data.get('payment_status', 'Unpaid')

    booking = Booking(
        user_id=user_id,
        tour_id=tour_id,
        booking_date=booking_date,
        status=status,
        payment_status=payment_status
    )

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'id': booking.id,
        'user_id': booking.user_id,
        'tour_id': booking.tour_id,
        'booking_date': booking.booking_date,
        'status': booking.status,
        'payment_status': booking.payment_status
    }), 201

# Get all bookings for a user
@bp.route('/users/<int:user_id>/bookings', methods=['GET'])
def get_user_bookings(user_id):
    bookings = Booking.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': booking.id,
        'user_id': booking.user_id,
        'tour_id': booking.tour_id,
        'booking_date': booking.booking_date,
        'status': booking.status,
        'payment_status': booking.payment_status
    } for booking in bookings])

# Create a new review
@bp.route('/reviews', methods=['POST'])
def create_review():
    data = request.get_json()
    user_id = data.get('user_id')
    tour_id = data.get('tour_id')
    rating = data.get('rating')
    review_text = data.get('review_text')

    review = Review(
        user_id=user_id,
        tour_id=tour_id,
        rating=rating,
        review_text=review_text
    )

    db.session.add(review)
    db.session.commit()

    return jsonify({
        'id': review.id,
        'user_id': review.user_id,
        'tour_id': review.tour_id,
        'rating': review.rating,
        'review_text': review.review_text
    }), 201

# Get all reviews for a specific tour
@bp.route('/tours/<int:tour_id>/reviews', methods=['GET'])
def get_tour_reviews(tour_id):
    reviews = Review.query.filter_by(tour_id=tour_id).all()
    return jsonify([{
        'id': review.id,
        'user_id': review.user_id,
        'tour_id': review.tour_id,
        'rating': review.rating,
        'review_text': review.review_text
    } for review in reviews])

# Get all reviews for a specific user
@bp.route('/users/<int:user_id>/reviews', methods=['GET'])
def get_user_reviews(user_id):
    reviews = Review.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': review.id,
        'user_id': review.user_id,
        'tour_id': review.tour_id,
        'rating': review.rating,
        'review_text': review.review_text
    } for review in reviews])

# Update a booking status
@bp.route('/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.get_json()
    booking = Booking.query.get_or_404(booking_id)

    # Update booking fields
    booking.status = data.get('status', booking.status)
    booking.payment_status = data.get('payment_status', booking.payment_status)

    db.session.commit()

    return jsonify({
        'id': booking.id,
        'user_id': booking.user_id,
        'tour_id': booking.tour_id,
        'booking_date': booking.booking_date,
        'status': booking.status,
        'payment_status': booking.payment_status
    })

# Delete a booking
@bp.route('/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'Booking deleted successfully'})

# Update a review
@bp.route('/reviews/<int:review_id>', methods=['PUT'])
def update_review(review_id):
    data = request.get_json()
    review = Review.query.get_or_404(review_id)

    # Update review fields
    review.rating = data.get('rating', review.rating)
    review.review_text = data.get('review_text', review.review_text)

    db.session.commit()

    return jsonify({
        'id': review.id,
        'user_id': review.user_id,
        'tour_id': review.tour_id,
        'rating': review.rating,
        'review_text': review.review_text
    })

# Delete a review
@bp.route('/reviews/<int:review_id>', methods=['DELETE'])
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()

    return jsonify({'message': 'Review deleted successfully'})

# Add a new user
@bp.route('/users', methods=['POST'])
def create_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    password_hash = generate_password_hash(password)  # Hash the password

    user = User(
        username=username,
        email=email,
        password_hash=password_hash
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    }), 201

# Get all users
@bp.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'email': user.email
    } for user in users])

# Get a specific user
@bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })

# Add a new tour
@bp.route('/tours', methods=['POST'])
def create_tour():
    data = request.get_json()
    name = data.get('name')
    location = data.get('location')
    description = data.get('description')
    price = data.get('price')

    tour = Tour(
        name=name,
        location=location,
        description=description,
        price=price
    )

    db.session.add(tour)
    db.session.commit()

    return jsonify({
        'id': tour.id,
        'name': tour.name,
        'location': tour.location,
        'description': tour.description,
        'price': tour.price
    }), 201

# Get all tours
@bp.route('/tours', methods=['GET'])
def get_tours():
    tours = Tour.query.all()
    return jsonify([{
        'id': tour.id,
        'name': tour.name,
        'location': tour.location,
        'description': tour.description,
        'price': tour.price
    } for tour in tours])

# Get a specific tour
@bp.route('/tours/<int:tour_id>', methods=['GET'])
def get_tour(tour_id):
    tour = Tour.query.get_or_404(tour_id)
    return jsonify({
        'id': tour.id,
        'name': tour.name,
        'location': tour.location,
        'description': tour.description,
        'price': tour.price
    })
