# import firebase_admin
# from firebase_admin import credentials, messaging

# cred = credentials.Certificate("serviceAccountKey.json")
# firebase_admin.initialize_app(cred)

import firebase_admin
from firebase_admin import credentials, messaging
from flask import current_app

if not firebase_admin._apps:
    cred = credentials.Certificate("cardiogo-25118-firebase-adminsdk-fbsvc-8c638ad2ae.json")
    firebase_admin.initialize_app(cred)

def send_fcm_message(token, title, body, data=None):
    try:
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            token=token,
            data=data or {}
        )
        return messaging.send(message)

    except Exception as e:
        current_app.logger.error(f"Error sending FCM message: {e}")
        return None

def send_fcm_to_topic(topic, title, body, data=None):
    try:
        print(topic)
        message = messaging.Message(
            notification=messaging.Notification(title=title, body=body),
            topic=topic,
            data=data or {}
        )
        return messaging.send(message)

    except Exception as e:
        current_app.logger.error(f"Error sending FCM topic message: {e}")
        return None

def subscribe_token_to_topic(token, topic):
    try:
        response = messaging.subscribe_to_topic([token], topic)
        return response
    except Exception as e:
        current_app.logger.error(f"Error subscribing token: {e}")
        return None

