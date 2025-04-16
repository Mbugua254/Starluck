from app import db

# User Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)  # If you need password hashing
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    role = db.Column(db.String(20), default='user')



    tours = db.relationship('Tour', secondary='user_tours', back_populates='users')
    bookings = db.relationship('Booking', backref='user', lazy=True)
    reviews = db.relationship('Review', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def is_admin(self):
        return self.role == 'admin'

# Tour Model
class Tour(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    price = db.Column(db.Float, nullable=False)  # Optional: If pricing is involved
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    users = db.relationship('User', secondary='user_tours', back_populates='tours')
    bookings = db.relationship('Booking', backref='tour', lazy=True)
    reviews = db.relationship('Review', backref='tour', lazy=True)

    def __repr__(self):
        return f'<Tour {self.name}>'

# Booking Model
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), nullable=False)
    booking_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(50), nullable=False, default='pending')
    payment_status = db.Column(db.String(50), nullable=False, default='pending')

    def __repr__(self):
        return f'<Booking {self.id}>'

# Review Model
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(500))
    review_text = db.Column(db.String(500), nullable=False) 
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<Review {self.id}>'

# UserTours Model (Many-to-Many Relationship Table)
class UserTours(db.Model):
    __tablename__ = 'user_tours'
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), primary_key=True)
    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), primary_key=True)

    def __repr__(self):
        return f'<UserTours {self.user_id} - {self.tour_id}>'
