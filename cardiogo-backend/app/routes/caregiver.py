from flask import Blueprint, request
from app.controllers import caregiver as caregiver_controller
from flask_jwt_extended import jwt_required

caregiver_bp = Blueprint('caregiver', __name__)

@caregiver_bp.route("/", methods=["GET"])
@jwt_required()
def list_caregivers():
    return caregiver_controller.get_all()

@caregiver_bp.get("/patient/<int:usuario_id>")
def get_paciente(usuario_id):
    return caregiver_controller.get_paciente_by_usuario(usuario_id)

@caregiver_bp.route("/<int:caregiver_id>", methods=["GET"])
@jwt_required()
def get_caregiver(caregiver_id):
    return caregiver_controller.get_by_id(caregiver_id)

@caregiver_bp.route("/", methods=["POST"])
@jwt_required()
def create_caregiver():
    data = request.json
    return caregiver_controller.create(data)

@caregiver_bp.route("/<int:caregiver_id>", methods=["PUT"])
@jwt_required()
def update_caregiver(caregiver_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return caregiver_controller.update(caregiver_id, data, dinamico)

@caregiver_bp.route("/<int:caregiver_id>", methods=["DELETE"])
@jwt_required()
def delete_caregiver(caregiver_id):
    return caregiver_controller.delete(caregiver_id)

@caregiver_bp.route("/count", methods=["GET"])
@jwt_required()
def count_caregivers():
    return caregiver_controller.count()