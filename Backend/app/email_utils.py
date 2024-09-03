from mailjet_rest import Client
from config import Config

# Initialize Mailjet client with configuration
mailjet = Client(auth=(Config.MAILJET_API_KEY, Config.MAILJET_API_SECRET), version='v3.1')

def send_reset_email(email, reset_link):
    data = {
        'Messages': [
            {
                "From": {
                    "Email": Config.MAILJET_FROM_EMAIL,
                    "Name": "Your App Name"
                },
                "To": [
                    {
                        "Email": email,
                        "Name": "Recipient Name"
                    }
                ],
                "Subject": "Password Reset Request",
                "TextPart": "Please click on the link below to reset your password.",
                "HTMLPart": f"<h3>Dear User,</h3><br /><p>Please click on the link below to reset your password:</p><br /><a href='{reset_link}'>Reset Password</a>"
            }
        ]
    }

    result = mailjet.send.create(data=data)

    # Log the response for debugging
    print(f"Mailjet response status: {result.status_code}")
    print(f"Mailjet response body: {result.json()}")

    if result.status_code == 200:
        return True
    else:
        print(f"Failed to send email: {result.status_code}, {result.json()}")
        return False

