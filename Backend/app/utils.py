from flask import current_app
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer as Serializer, BadSignature, SignatureExpired
from app import mail
def generate_reset_token(email):
    s = Serializer(current_app.config['SECRET_KEY'])
    return s.dumps(email, salt='password-reset-salt')

def verify_reset_token(token, expiration=3600):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=expiration)
    except (BadSignature, SignatureExpired):
        return None
    return email

def send_reset_password_email(to_email, token):
    reset_url = f'http://localhost:3000/reset-password/{token}'

    msg = Message(
        subject='Reset Your Password',
        sender=current_app.config['MAILJET_FROM_EMAIL'],
        recipients=[to_email]
    )
    msg.body = f'Click the link below to reset your password:\n\n{reset_url}'
    msg.html = f'<p>Click the link below to reset your password:</p><p><a href="{reset_url}">Reset Password</a></p>'
    
    mail.send(msg)

