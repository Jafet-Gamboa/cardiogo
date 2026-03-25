from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from app.controllers.caregiver_patient import (
    caregiver_patient_list,
    get_search_patient,
    caregiver_patient_information,
    create,
    search_patient_by_id
)
from app.utils.response import success_response, error_response

caregiver_patient_bp = Blueprint('caregiver_patient_bp', __name__, url_prefix='/caregiver_patient')

@caregiver_patient_bp.route('/', methods=['GET'])
def caregiver_patient_list_route():
    try:
        data = caregiver_patient_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@caregiver_patient_bp.route('/information', methods=['GET'])
@jwt_required()
def caregiver_patient_information_route():
    try:
        user_id = get_jwt_identity()
        data = caregiver_patient_information(user_id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
    
@caregiver_patient_bp.route('/buscar/<string:query>', methods=['GET'])
def search_patient(query):
    try:
        data = get_search_patient(query)
        if not data:
            return error_response("Sin resultados", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
    
@caregiver_patient_bp.route('/buscarById/<string:query>', methods=['GET'])
def search_patientById(query):
    try:
        data = search_patient_by_id(query)  

        if not data:
            return error_response("Sin resultados", 404)

        return success_response(data, 200)

    except Exception as e:
        return error_response(str(e), 500)


@caregiver_patient_bp.route("/", methods=["POST"])
@jwt_required()
def create_caregiver():
    data = request.json
    return create(data)