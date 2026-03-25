from flask import Blueprint, request
from app.controllers import address as address_controller
from flask_jwt_extended import jwt_required

address_bp = Blueprint('address', __name__)

@address_bp.route("/", methods=["GET"])
@jwt_required()
def list_addresses():
    return address_controller.get_all()

@address_bp.route("/<int:address_id>", methods=["GET"])
@jwt_required()
def get_address(address_id):
    return address_controller.get_by_id(address_id)

@address_bp.route("/", methods=["POST"])
@jwt_required()
def create_address():
    data = request.json
    return address_controller.create(data)

@address_bp.route("/<int:address_id>", methods=["PUT"])
@jwt_required()
def update_address(address_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return address_controller.update(address_id, data, dinamico)

@address_bp.route("/<int:address_id>", methods=["DELETE"])
@jwt_required()
def delete_address(address_id):
    return address_controller.delete(address_id)
