from flask import Blueprint, request
from app.controllers import alert_type as alert_type_controller
from flask_jwt_extended import jwt_required

alert_type_bp = Blueprint('alert_types', __name__)

@alert_type_bp.route("/", methods=["GET"])
@jwt_required()
def list_alert_types():
    return alert_type_controller.get_all()

@alert_type_bp.route("/<int:type_id>", methods=["GET"])
@jwt_required()
def get_alert_type(type_id):
    return alert_type_controller.get_by_id(type_id)

@alert_type_bp.route("/", methods=["POST"])
@jwt_required()
def create_alert_type():
    data = request.json
    return alert_type_controller.create(data)

@alert_type_bp.route("/<int:alert_type_id>", methods=["PUT"])
@jwt_required()
def update_alert_type(alert_type_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return alert_type_controller.update(alert_type_id, data, dinamico)

@alert_type_bp.route("/<int:type_id>", methods=["DELETE"])
@jwt_required()
def delete_alert_type(type_id):
    return alert_type_controller.delete(type_id)

@alert_type_bp.route("/types_count/<int:patient_id>", methods=["GET"])
@jwt_required()
def types_count_by_patient(patient_id):
    return alert_type_controller.get_types_count_by_patient(patient_id)