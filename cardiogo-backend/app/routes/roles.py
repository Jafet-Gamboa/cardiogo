from flask import Blueprint, request
from app.controllers import roles as roles_controller
from flask_jwt_extended import jwt_required

roles_bp = Blueprint('roles', __name__)

@roles_bp.route("/", methods=["GET"])
@jwt_required()
def list_roles():
    return roles_controller.get_all()

@roles_bp.route("/<int:role_id>", methods=["GET"])
@jwt_required()
def get_role(role_id):
    return roles_controller.get_by_id(role_id)

@roles_bp.route("/", methods=["POST"])
@jwt_required()
def create_role():
    data = request.json
    return roles_controller.create(data)

@roles_bp.route("/<int:role_id>", methods=["PUT"])
@jwt_required()
def update_role(role_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return roles_controller.update(role_id, data, dinamico)

@roles_bp.route("/<int:role_id>", methods=["DELETE"])
@jwt_required()
def delete_role(role_id):
    return roles_controller.delete(role_id)