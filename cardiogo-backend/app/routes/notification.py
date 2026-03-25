from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers import notification as notification_controller

notification_bp = Blueprint("notifications", __name__)

@notification_bp.route("/subscribe", methods=["POST"])
@jwt_required()
def subscribe():
    data = request.json
    token = data.get("token")
    topic = data.get("topic", "alertas")

    return notification_controller.subscribe_token(token, topic)

@notification_bp.route("/subscribe/paciente", methods=["POST"])
@jwt_required()
def subscribe_paciente():
    data = request.json
    token = data.get("token")
    paciente_id = data.get("paciente_id")

    return notification_controller.subscribe_paciente_topic(token, paciente_id)

@notification_bp.route("/", methods=["POST"])
@jwt_required()
def save_fcm_token():
    user_id = get_jwt_identity()
    data = request.json

    data["user_id"] = user_id
    return notification_controller.save_token(data)

@notification_bp.route("/tokens", methods=["GET"])
@jwt_required()
def list_tokens():
    user_id = get_jwt_identity()
    return notification_controller.get_tokens_by_user(user_id)

@notification_bp.route("/delete-token", methods=["DELETE"])
@jwt_required()
def delete_token():
    data = request.json
    return notification_controller.delete_token(data.get("token"))
