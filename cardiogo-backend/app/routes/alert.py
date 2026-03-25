from flask import Blueprint, request
from app.controllers.alert import (
    alert_list,
    get_alert,
    create,
    update,
    delete,
    get_alert_no_read_by_caregiver,
    get_alert_read_by_caregiver,
    get_alert_no_read_by_patient,
    get_alert_no_read_count_by_caregiver,
    get_alert_no_read_count_by_patient,
    get_alert_read_by_patient,
    update_leido_p,
    update_leido_c
)
from app.utils.response import success_response, error_response
from flask_jwt_extended import jwt_required

# Blueprint para las rutas de alertas
alert_bp = Blueprint('alert_bp', __name__, url_prefix='/alerts')


@alert_bp.route('/', methods=['GET'])
def listar_alertas():
    try:
        data = alert_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)


@alert_bp.route('/<int:alert_id>', methods=['GET'])
def obtener_alerta(alert_id):
    try:
        data = get_alert(alert_id)
        if not data:
            return error_response("Alerta no encontrada", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/paciente/leido/<int:id>', methods=['GET'])
def get_alert_read_by_paciente(id):
    try:
        data = get_alert_read_by_patient(id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/paciente/no_leido/<int:id>', methods=['GET'])
def get_alert_no_read_by_paciente(id):
    try:
        print(id)
        data = get_alert_no_read_by_patient(id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/paciente/count/<int:id>', methods=['GET'])
def get_alert_no_read_count_by_paciente(id):
    try:
        data = get_alert_no_read_count_by_patient(id)
        return success_response(data, group=False)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/cuidador/leido/<int:id>', methods=['GET'])
def get_alert_read_by_cuidador(id):
    try:
        data = get_alert_read_by_caregiver(id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/cuidador/no_leido/<int:id>', methods=['GET'])
def get_alert_no_read_by_cuidador(id):
    try:
        data = get_alert_no_read_by_caregiver(id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/cuidador/count/<int:id>', methods=['GET'])
def get_alert_no_read_count_by_cuidador(id):
    try:
        data = get_alert_no_read_count_by_caregiver(id)
        return success_response(data, group=False)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route('/', methods=['POST'])
def crear_alerta():
    try:
        body = request.get_json()
        data = create(body)
        return success_response(data, 201)
    except Exception as e:
        return error_response(str(e), 500)

@alert_bp.route("/<int:alert_id>", methods=["PUT"])
@jwt_required()
def update_paciente(alert_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return update(alert_id, data, dinamico)

@alert_bp.route("/paciente/<int:alert_id>", methods=["PUT"])
@jwt_required()
def update_leido_paciente(alert_id):
    return update_leido_p(alert_id)

@alert_bp.route("/cuidador/<int:alert_id>", methods=["PUT"])
@jwt_required()
def update_leido_cuidador(alert_id):
    print("Hols")
    return update_leido_c(alert_id)

@alert_bp.route('/<int:alert_id>', methods=['DELETE'])
def eliminar_alerta(alert_id):
    try:
        data = delete(alert_id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
