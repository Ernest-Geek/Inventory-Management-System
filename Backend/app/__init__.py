import sys
sys.path.append('/Users/eunice/Desktop/Inventory-Management-System/Backend/venv/lib/python3.x/site-packages')
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_mail import Mail
from flask_login import LoginManager

# Initialize Flask extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
mail = Mail()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')  # Load configuration

    # Initialize extensions with the app
    db.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    login_manager.init_app(app)

    # Configure LoginManager
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    # Import models here after initializing db
    from app.models import User  # Ensure this import is after db is initialized

    # Register the user_loader function
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Register blueprints after initializing app and importing models
    from app.routes import auth_bp, bp as routes_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(routes_bp)

    return app



