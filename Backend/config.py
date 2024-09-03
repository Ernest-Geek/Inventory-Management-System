from dotenv import load_dotenv
import os

# Load environment variables from a .env file
load_dotenv()

class Config:
    # Security key for sessions and forms
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_secret_key'

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///site.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Mailjet configuration
    MAILJET_API_KEY = os.environ.get('MAILJET_API_KEY')
    MAILJET_API_SECRET = os.environ.get('MAILJET_API_SECRET')
    MAILJET_FROM_EMAIL = os.environ.get('MAILJET_FROM_EMAIL')

    # Print statements for debugging (can be removed in production)
    print(f"Mailjet API Key: {MAILJET_API_KEY}")
    print(f"Mailjet API Secret: {MAILJET_API_SECRET}")
    print(f"Mailjet From Email: {MAILJET_FROM_EMAIL}")



    