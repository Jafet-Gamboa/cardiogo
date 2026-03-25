from flask import Blueprint, request, jsonify, current_app
from app.controllers import user as user_controller
from app.schemas.user import UsuarioSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.response import error_response

user_bp = Blueprint("user", __name__)

@user_bp.get("/")
def list_users():
    return user_controller.user_list()

@user_bp.get("/<int:user_id>")
def list_by_id(user_id):
    return user_controller.user_id(user_id)

@user_bp.get("/cards")
def cards():
    return user_controller.cards()

@user_bp.post("/")
def create_user():
    data = request.get_json()
    return user_controller.create(data)

@user_bp.patch("/<int:user_id>")
def update_user(user_id):
    return user_controller.update_user(user_id)

@user_bp.route("/<int:usuario_id>", methods=["PUT"])
@jwt_required()
def update_usuario(usuario_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return user_controller.update(usuario_id, data, dinamico)

@user_bp.get("/datos/<int:user_id>")
def get_profile_user(user_id):
    return user_controller.get_profile_user(user_id)
