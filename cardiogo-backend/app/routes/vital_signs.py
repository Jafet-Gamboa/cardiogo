from flask import Blueprint, request
from app.controllers.vital_signs import (
    vital_signs_list,
    get_vital_signs,
    create,
    vital_signs_list_information
)
from app.utils.response import success_response, error_response

vital_signs_bp = Blueprint('vital_signs_bp', __name__, url_prefix='/vital_signs')

@vital_signs_bp.route('/', methods=['GET'])
def vital_signs_list_route():
    try:
        data = vital_signs_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@vital_signs_bp.route('/pacientes', methods=['GET'])
def vital_signs_list_pacientes():
    try:
        data = vital_signs_list_information()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@vital_signs_bp.route('/<int:vital_signs_id>', methods=['GET'])
def get_vital_signs_route(vital_signs_id):
    try:
        data = get_vital_signs(vital_signs_id)
        if not data:
            return error_response("Rango no encontrado", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
    
@vital_signs_bp.route('/', methods=['POST'])
def create_vital_signs():
    try:
        body = request.get_json()
        data = create(body)
        return success_response(data, 201)
    except Exception as e:
        return error_response(str(e), 500)
