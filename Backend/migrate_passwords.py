from app import create_app, db
from app.models import User, Role

def main():
    # Create an app instance using the factory function
    app = create_app()

    with app.app_context():
        # Create a new role
        admin_role = Role(name='Admin', description='Administrator')
        db.session.add(admin_role)
        db.session.commit()

        # Create a new user with this role
        new_user = User(username='Ernest', email='michelle1@gmail.com', role_id=admin_role.id)
        new_user.set_password('password')
        db.session.add(new_user)
        db.session.commit()

        # Query the user and print role name
        user = User.query.first()
        if user and user.role:
            print(user.role.name)  # Should print 'Admin'
        else:
            print("No user or role found.")

if __name__ == "__main__":
    main()



