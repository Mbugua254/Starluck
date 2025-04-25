from flask import Blueprint, request, jsonify
from functools import wraps
from app import db
from app.models import User, Tour, Booking, Review
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash  # Import this to check passwords
import jwt  # For JWT handling
from datetime import timedelta  # For token expiration time

bp = Blueprint('api', __name__)

# Secret key for encoding/decoding JWT (should be kept secret and secure)
SECRET_KEY = 'your_secret_key'

#Authenticated users only
def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = data['user_id']
        except Exception as e:
            return jsonify({'message': 'Token is invalid!', 'error': str(e)}), 403
        return f(current_user, *args, **kwargs)
    return decorated_function

#Protected routes (admins only access)
def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization', None)
        if not token:
            return jsonify({'message': 'Missing token'}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            user = User.query.get(data['user_id'])
            if not user or user.role != 'admin':
                return jsonify({'message': 'Admin access required'}), 403
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 401

        return f(*args, **kwargs)
    return decorated_function



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
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                "role": user.role
                }
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
    booking_date = data.get('booking_date', datetime.now())

    if isinstance(booking_date, str):
        booking_date = datetime.fromisoformat(booking_date)
        
    status = data.get('status', 'Pending')  # Default status is 'Pending'
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
    result = []
    for review in reviews:
        user = User.query.get(review.user_id)
        result.append({
            'username': user.username,
            'review_text': review.review_text,
            'rating': review.rating
        })
    return jsonify(result)

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
@token_required
def update_booking(current_user, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != current_user:
        return jsonify({'message': 'You are not authorized to edit this booking.'}), 403
    data = request.get_json()
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
@token_required
def delete_booking(current_user, booking_id):
    booking = Booking.query.get_or_404(booking_id)
    if booking.user_id != current_user:
        return jsonify({'message': 'You are not authorized to delete this booking.'}), 403
    db.session.delete(booking)
    db.session.commit()

    return jsonify({'message': 'Booking deleted successfully'})

# Update a review
@bp.route('/reviews/<int:review_id>', methods=['PUT'])
@token_required
def update_review(current_user, review_id):
    review = Review.query.get_or_404(review_id)
    if review.user_id != current_user:
        return jsonify({'message': 'You are not authorized to edit this review.'}), 403
    data = request.get_json()
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
@token_required
def delete_review(current_user, review_id):
    review = Review.query.get_or_404(review_id)
    if review.user_id != current_user:
        return jsonify({'message': 'You are not authorized to delete this review.'}), 403
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

# Add a new tour : Testing admin roles
@bp.route('/tours', methods=['POST'])

def create_tour():
    data = request.get_json()
    new_tour = Tour(
        name=data['name'],
        location=data['location'],
        description=data['description'],
        price=data['price']
    )
    db.session.add(new_tour)
    db.session.commit()

    return jsonify({
        'message': 'Tour created successfully',
        'tour': {
            'id': new_tour.id,
            'name': new_tour.name,
            'location': new_tour.location,
            'description': new_tour.description,
            'price': new_tour.price
        }
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

# Update tour details
@bp.route('/tours/<int:tour_id>', methods=['PUT'])

def update_tour(tour_id):
    data = request.get_json()
    tour = Tour.query.get_or_404(tour_id)

    tour.name = data.get('name', tour.name)
    tour.location = data.get('location', tour.location)
    tour.description = data.get('description', tour.description)
    tour.price = data.get('price', tour.price)

    db.session.commit()

    return jsonify({
        'message': 'Tour updated successfully',
        'tour': {
            'id': tour.id,
            'name': tour.name,
            'location': tour.location,
            'description': tour.description,
            'price': tour.price
        }
    }), 200


@bp.route('/reviews/recent/5star', methods=['GET'])
def get_recent_5star_review():
    # Fetch the most recent 5-star review
    review = Review.query.filter_by(rating=5).order_by(Review.created_at.desc()).first()
    if review:
        # Fetch the user associated with the review
        user = User.query.get(review.user_id)
        if user:
            return jsonify({
                'username': user.username,
                'review_text': review.review_text,
                'rating': review.rating,
                'created_at': review.created_at
            })
        else:
            return jsonify({'message': 'User not found'}), 404
    else:
        return jsonify({'message': 'No 5-star reviews found'}), 404

@bp.route('/bookings', methods=['GET'])
  # Optional if this should be admin-only
def get_all_bookings():
    bookings = Booking.query.all()
    return jsonify([{
        'id': b.id,
        'user_id': b.user_id,
        'tour_id': b.tour_id,
        'booking_date': b.booking_date.isoformat(),
        'status': b.status,
        'payment_status': b.payment_status
    } for b in bookings])

    # Get all reviews
@bp.route('/reviews', methods=['GET'])
def get_all_reviews():
    reviews = Review.query.all()
    result = []
    for review in reviews:
        user = User.query.get(review.user_id)
        result.append({
            'username': user.username,
            'tour_id': review.tour_id,
            'rating': review.rating,
            'review_text': review.review_text,
            'created_at': review.created_at
        })
    return jsonify(result)

# Delete a tour (admin only)
@bp.route('/tours/<int:tour_id>', methods=['DELETE'])

def delete_tour(tour_id):
    tour = Tour.query.get_or_404(tour_id)
    db.session.delete(tour)
    db.session.commit()
    return jsonify({'message': 'Tour deleted successfully'})


@bp.route('/bookings/<int:booking_id>/confirm', methods=['PATCH'])

def confirm_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)

    # Change status to 'Confirmed'
    booking.status = 'Confirmed'

    db.session.commit()

    return jsonify({
        'id': booking.id,
        'user_id': booking.user_id,
        'tour_id': booking.tour_id,
        'booking_date': booking.booking_date,
        'status': booking.status,
        'payment_status': booking.payment_status
    }), 200

