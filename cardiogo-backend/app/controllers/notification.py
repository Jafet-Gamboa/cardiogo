from flask import current_app
from app.models import notification as notification_model
from app.utils.response import success_response, error_response
from app.utils.notifications import subscribe_token_to_topic

def subscribe_token(token, topic):
    try:
        if not token:
            return error_response("Token requerido", 400)

        result = subscribe_token_to_topic(token, topic)

        if not result:
            return error_response("No se pudo suscribir el token al topic", 500)

        return success_response({
            "message": f"Token suscrito al topic '{topic}' correctamente"
        })

    except Exception as e:
        current_app.logger.error(f"Error subscribing token: {e}")
        return error_response("Internal error subscribing token", 500)

def subscribe_paciente_topic(token, paciente_id):
    try:
        if not token:
            return error_response("Token requerido", 400)

        if not paciente_id:
            return error_response("paciente_id requerido", 400)

        topic = f"paciente_{paciente_id}_alertas"

        result = subscribe_token_to_topic(token, topic)

        if not result:
            return error_response("Error al suscribir token al topic del paciente", 500)

        return success_response({
            "message": f"Token suscrito al topic dinámico {topic}"
        })

    except Exception as e:
        current_app.logger.error(f"Error subscribing token to patient topic: {e}")
        return error_response("Internal error subscribing token", 500)

def save_token(data):
    try:
        token_id = notification_model.save_token(data)
        return success_response({"id": token_id}, group=False, status=0)
    except Exception as e:
        current_app.logger.error(f"Error saving FCM token: {e}")
        return error_response("Internal error saving FCM token", 500)

def get_tokens_by_user(user_id):
    try:
        tokens = notification_model.get_by_user_id(user_id)
        return success_response(tokens)
    except Exception as e:
        current_app.logger.error(f"Error listing tokens: {e}")
        return error_response("Internal error getting tokens", 500)

def delete_token(token):
    try:
        deleted = notification_model.delete_token(token)
        if deleted == 0:
            return error_response("Token not found", 404)
        return success_response({"message": "Token deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting token: {e}")
        return error_response("Internal error deleting token", 500)
