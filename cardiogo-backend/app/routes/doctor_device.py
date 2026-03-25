from flask import Blueprint, request
from app.controllers.doctor_device import (
    doctor_device_list,
    get_search_doctor
)
from app.utils.response import success_response, error_response

doctor_device_bp = Blueprint('doctor_device_bp', __name__, url_prefix='/doctor_device')

@doctor_device_bp.route('/', methods=['GET'])
def doctor_device_list_route():
    try:
        data = doctor_device_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@doctor_device_bp.route('/buscar/<string:query>', methods=['GET'])
def search_doctor(query):
    try:
        data = get_search_doctor(query)
        if not data:
            return error_response("Sin resultados", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

