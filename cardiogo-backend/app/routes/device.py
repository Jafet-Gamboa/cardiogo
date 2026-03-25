from flask import Blueprint, request
from app.controllers import device as device_controller
from flask_jwt_extended import jwt_required

device_bp = Blueprint('device', __name__)

@device_bp.route("/", methods=["GET"])
@jwt_required()
def list_devices():
    return device_controller.get_all()

@device_bp.route("/only", methods=["GET"])
@jwt_required()
def list_only_devices():
    return device_controller.get_all_devicess()

@device_bp.route("/<int:device_id>", methods=["GET"])
@jwt_required()
def get_device(device_id):
    return device_controller.get_by_id(device_id)

@device_bp.route("paciente/<int:patient_id>", methods=["GET"])
@jwt_required()
def get_by_patient_id(patient_id):
    return device_controller.get_by_patient_id(patient_id)

@device_bp.route("cuidador/<int:cuidador_id>", methods=["GET"])
@jwt_required()
def get_by_cuidador_id(cuidador_id):
    return device_controller.get_by_cuidador_id(cuidador_id)


@device_bp.route("/", methods=["POST"])
@jwt_required()
def create_device():
    data = request.json
    return device_controller.create(data)

@device_bp.route("/<int:dispositivo_id>", methods=["PUT"])
@jwt_required()
def update_dispositivo(dispositivo_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return device_controller.update(dispositivo_id, data, dinamico)

@device_bp.route("/<int:device_id>", methods=["DELETE"])
@jwt_required()
def delete_device(device_id):
    return device_controller.delete(device_id)