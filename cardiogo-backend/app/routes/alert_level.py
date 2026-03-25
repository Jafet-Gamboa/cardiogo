from flask import Blueprint, request
from app.controllers import alert_level as alert_level_controller
from flask_jwt_extended import jwt_required

alert_level_bp = Blueprint('alert_levels', __name__)

@alert_level_bp.route("/", methods=["GET"])
@jwt_required()
def list_alert_levels():
    return alert_level_controller.get_all()

@alert_level_bp.route("/<int:level_id>", methods=["GET"])
@jwt_required()
def get_alert_level(level_id):
    return alert_level_controller.get_by_id(level_id)

@alert_level_bp.route("/", methods=["POST"])
@jwt_required()
def create_alert_level():
    data = request.json
    return alert_level_controller.create(data)

@alert_level_bp.route("/<int:alert_level_id>", methods=["PUT"])
@jwt_required()
def update_alert_level(alert_level_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return alert_level_controller.update(alert_level_id, data, dinamico)

@alert_level_bp.route("/<int:level_id>", methods=["DELETE"])
@jwt_required()
def delete_alert_level(level_id):
    return alert_level_controller.delete(level_id)

@alert_level_bp.route("/levels_count/<int:patient_id>", methods=["GET"])
@jwt_required()
def levels_count_by_patient(patient_id):
    return alert_level_controller.get_levels_count_by_patient(patient_id)
