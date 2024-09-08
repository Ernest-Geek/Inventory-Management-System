from app import create_app, db
from flask_cors import CORS

# Initialize the app with CORS support
app = create_app()
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Ensure all database tables are created
with app.app_context():
    db.create_all()

# Run the app
if __name__ == "__main__":
    app.run(debug=True)


