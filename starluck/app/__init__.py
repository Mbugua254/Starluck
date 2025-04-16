from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS



db = SQLAlchemy()
migrate = Migrate()


def create_app():
    app = Flask(__name__)

    
    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'  # Example with SQLite
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'your-secret-key'  # Change it to something secret

    # Initialize the app with the database and migrations
    db.init_app(app)
    migrate.init_app(app, db)
   

    CORS(app)

    from . import routes  # Import routes after initializing app and db
    app.register_blueprint(routes.bp)  # Register Blueprint for routes

    return app
