from flask import Blueprint, request
from app.controllers import prescription as prescription_controller
from flask_jwt_extended import jwt_required

prescription_bp = Blueprint('prescription', __name__)

@prescription_bp.route("/", methods=["GET"])
@jwt_required()
def list_prescriptions():
    return prescription_controller.get_all()

@prescription_bp.route("/<int:receta_id>", methods=["GET"])
@jwt_required()
def get_prescription(receta_id):
    return prescription_controller.get_by_id(receta_id)

@prescription_bp.route("/paciente/<int:paciente_id>", methods=["GET"])
@jwt_required()
def get_prescriptions_for_patient(paciente_id):
    return prescription_controller.get_prescriptions_by_patient(paciente_id)

@prescription_bp.route("/cuidador/<int:id>", methods=["GET"])
@jwt_required()
def get_prescriptions_for_cuidador(id):
    return prescription_controller.get_prescriptions_by_caregiver(id)

@prescription_bp.route("/", methods=["POST"])
@jwt_required()
def create_prescription():
    data = request.json
    return prescription_controller.create(data)

@prescription_bp.route("/<int:prescription_id>", methods=["PUT"])
@jwt_required()
def update_prescription(prescription_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return prescription_controller.update(prescription_id, data, dinamico)

@prescription_bp.route("/<int:receta_id>", methods=["DELETE"])
@jwt_required()
def delete_prescription(receta_id):
    return prescription_controller.delete(receta_id)