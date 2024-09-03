from flask import Flask
from flask_cors import CORS, cross_origin
from app import create_app, db

# Initialize the app with CORS support
app = create_app()
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# Run the app
if __name__ == "__main__":
    with app.app_context():
        db.create_all()  # Ensure all database tables are created
    app.run(debug=True)

