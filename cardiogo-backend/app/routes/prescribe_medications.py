from flask import Blueprint, request
from app.controllers.prescribe_medications import (
    prescribe_medications_list_by_doctor,
    prescribe_medications_list_new,
    prescribe_medications_list_by_id,
    prescribe_medications_list_by_cuidador_id,
    get_search_patient,
    create_prescription
)
from app.utils.response import success_response, error_response

prescribe_medication_bp = Blueprint('prescribe_medication_bp', __name__, url_prefix='/prescribe_medication')

# GET: Todas las recetas
@prescribe_medication_bp.route('/doctor/<int:doctor_id>', methods=['GET'])
def prescribe_medication_list_route(doctor_id):
    try:
        data = prescribe_medications_list_by_doctor(doctor_id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

# GET: Todas las recetas (nueva vista)
@prescribe_medication_bp.route('/', methods=['GET'])
def prescribe_medication_list_new_route():
    try:
        data = prescribe_medications_list_new()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

# GET: Recetas de un paciente by cuidador_id
@prescribe_medication_bp.route('/cuidador/<int:cuidador_id>', methods=['GET'])
def prescribe_medications_list_by_cuidador_id_route(cuidador_id):
    try:
        data = prescribe_medications_list_by_cuidador_id(cuidador_id)
        if not data:
            return error_response("Sin resultados", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
    
# GET: Recetas de un paciente
@prescribe_medication_bp.route('paciente/<int:patient_id>', methods=['GET'])
def prescribe_medications_list_by_id_route(patient_id):
    try:
        data = prescribe_medications_list_by_id(patient_id)
        if not data:
            return error_response("Sin resultados", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

# GET: Buscar paciente/medico
@prescribe_medication_bp.route('/buscar/<string:query>', methods=['GET'])
def search_doctor(query):
    try:
        data = get_search_patient(query)
        if not data:
            return error_response("Sin resultados", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

# POST: Crear nueva receta
@prescribe_medication_bp.route('/', methods=['POST'])
def create_prescription_route():
    try:
        data = request.get_json()
        if not data:
            return error_response("Datos requeridos para crear la receta", 400)
        result = create_prescription(data)
        return success_response(result, 201)
    except Exception as e:
        return error_response(str(e), 500)
