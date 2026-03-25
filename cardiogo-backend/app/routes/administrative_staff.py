from flask import Blueprint, request
from app.controllers import administrative_staff as staff_controller
from flask_jwt_extended import jwt_required

administrative_staff_bp = Blueprint('administrative_staff', __name__)

@administrative_staff_bp.route("/", methods=["GET"])
@jwt_required()
def list_staff():
    return staff_controller.get_all()

@administrative_staff_bp.route("/<int:staff_id>", methods=["GET"])
@jwt_required()
def get_staff(staff_id):
    return staff_controller.get_by_id(staff_id)

@administrative_staff_bp.route("/count", methods=["GET"])
@jwt_required()
def count():
    return staff_controller.count()

@administrative_staff_bp.route("/", methods=["POST"])
@jwt_required()
def create_staff():
    data = request.json
    return staff_controller.create(data)

@administrative_staff_bp.route("/<int:personal_id>", methods=["PUT"])
@jwt_required()
def update_personal(personal_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return staff_controller.update(personal_id, data, dinamico)

@administrative_staff_bp.route("/<int:staff_id>", methods=["DELETE"])
@jwt_required()
def delete_staff(staff_id):
    return staff_controller.delete(staff_id)