from dotenv import load_dotenv
import os
from flask_cors import CORS

# Load environment variables from a .env file
load_dotenv()

class Config:
    # Security key for sessions and forms
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your_default_secret_key')

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///site.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Mailjet configuration
    MAILJET_API_KEY = os.environ.get('MAILJET_API_KEY')
    MAILJET_API_SECRET = os.environ.get('MAILJET_API_SECRET')
    MAILJET_FROM_EMAIL = os.environ.get('MAILJET_FROM_EMAIL')

    # Flask-Mail configuration
    MAIL_SERVER = 'in.mailjet.com'  # Mailjet SMTP server
    MAIL_PORT = 587  # Port for TLS
    MAIL_USERNAME = MAILJET_API_KEY
    MAIL_PASSWORD = MAILJET_API_SECRET
    MAIL_USE_TLS = True  # Use TLS
    MAIL_USE_SSL = False  # Do not use SSL

    # Print statements for debugging (can be removed in production)
    if MAILJET_API_KEY:
        print(f"Mailjet API Key: {MAILJET_API_KEY}")
    if MAILJET_API_SECRET:
        print(f"Mailjet API Secret: {MAILJET_API_SECRET}")
    if MAILJET_FROM_EMAIL:
        print(f"Mailjet From Email: {MAILJET_FROM_EMAIL}")




    