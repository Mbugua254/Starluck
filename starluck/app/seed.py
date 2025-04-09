import sys
import os
from werkzeug.security import generate_password_hash  # Import this to hash passwords
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import User, Tour

# Create an app instance
app = create_app()

# Open an application context
with app.app_context():
    # Seed Users with password hashes
    user1 = User(username='john_doe', email='john@example.com', password_hash=generate_password_hash('password123'))
    user2 = User(username='jane_doe', email='jane@example.com', password_hash=generate_password_hash('password456'))
    db.session.add(user1)
    db.session.add(user2)
    
    # Seed Tours
    tour1 = Tour(name='Paris Adventure', location='Paris, France', description='A wonderful tour of Paris!', price=100)
    tour2 = Tour(name='Rome Discovery', location='Rome, Italy', description='Explore the beauty of ancient Rome!', price=120)
    db.session.add(tour1)
    db.session.add(tour2)

    # Commit the changes
    db.session.commit()

    print("Database has been seeded!")
