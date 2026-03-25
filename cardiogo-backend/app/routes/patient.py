from flask import Blueprint, request
from app.controllers import patient as patient_controller
from flask_jwt_extended import jwt_required

patient_bp = Blueprint('patient_bp', __name__)

@patient_bp.route("/", methods=["GET"])
@jwt_required()
def list_patients():
    return patient_controller.patient_list()

@patient_bp.route("/<int:patient_id>", methods=["GET"])
@jwt_required()
def get_patient(patient_id):
    return patient_controller.get_patient(patient_id)

@patient_bp.route("/pacienteCompleto/<int:patient_id>", methods=["GET"])
@jwt_required()
def get_completePatient(patient_id):
    return patient_controller.get_complete_patient(patient_id)

@patient_bp.route("/", methods=["POST"])
@jwt_required()
def create_patient():
    data = request.json
    return patient_controller.create(data)

@patient_bp.route("/<int:paciente_id>", methods=["PUT"])
@jwt_required()
def update_paciente(paciente_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return patient_controller.update(paciente_id, data, dinamico)

@patient_bp.route("/<int:patient_id>", methods=["DELETE"])
@jwt_required()
def delete_patient(patient_id):
    return patient_controller.delete(patient_id)
