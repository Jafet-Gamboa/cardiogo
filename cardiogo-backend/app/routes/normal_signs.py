from flask import Blueprint, request
from app.controllers.normal_signs import (
    normal_signs_list,
    get_normal_signs_list_caregiver,
    get_normal_signs_list_patient,
    get_normal_signs,
    update,
    create
)
from app.utils.response import success_response, error_response
from flask_jwt_extended import jwt_required

normal_signs_bp = Blueprint('normal_signs_bp', __name__, url_prefix='/normal_signs')

@normal_signs_bp.route('/', methods=['GET'])
def normal_signs_list_route():
    try:
        data = normal_signs_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@normal_signs_bp.route('/<int:normal_signs_id>', methods=['GET'])
def get_normal_signs_route(normal_signs_id):
    try:
        data = get_normal_signs(normal_signs_id)
        if not data:
            return error_response("Rango no encontrado", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@normal_signs_bp.route('/paciente/<int:id>', methods=['GET'])
def normal_signs_by_patient(id):
    try:
        data = get_normal_signs_list_patient(id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@normal_signs_bp.route('/cuidador/<int:id>', methods=['GET'])
def normal_signs_by_cuidador(id):
    try:
        data = get_normal_signs_list_caregiver(id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@normal_signs_bp.route("/<int:rango_id>", methods=["PUT"])
@jwt_required()
def update_rango(rango_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return update(rango_id, data, dinamico)

@normal_signs_bp.route('/', methods=['POST'])
def create_normal_signs():
    try:
        body = request.get_json()
        data = create(body)
        return success_response(data, 201)
    except Exception as e:
        return error_response(str(e), 500)