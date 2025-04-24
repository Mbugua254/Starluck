import sys
import os
from werkzeug.security import generate_password_hash
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import User, Tour

# Create an app instance
app = create_app()

# Open an application context
with app.app_context():
    # Drop all and recreate tables (optional for fresh seed)
    db.drop_all()
    db.create_all()

    # Seed Users with roles
    admin_user = User(
        username='admin',
        email='admin@example.com',
        password_hash=generate_password_hash('admin123'),
        role='admin'
    )

    user1 = User(
        username='john_doe',
        email='john@example.com',
        password_hash=generate_password_hash('password123'),
        role='user'
    )

    user2 = User(
        username='jane_doe',
        email='jane@example.com',
        password_hash=generate_password_hash('password456'),
        role='user'
    )

    db.session.add_all([admin_user, user1, user2])

    # Seed Tours
    tour1 = Tour(name='Paris Adventure', location='Paris, France', description='A wonderful tour of Paris!', price=100, image_url="../assets/Paris.jpg")
    tour2 = Tour(name='Rome Discovery', location='Rome, Italy', description='Explore the beauty of ancient Rome!', price=120, image_url="../assets/Rome.jpg")
    db.session.add_all([tour1, tour2])

    # Commit changes
    db.session.commit()

    print("✅ Database has been seeded with users and tours.")
