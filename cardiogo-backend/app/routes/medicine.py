from flask import Blueprint, request
from app.controllers.medicine import (
    medicine_list,
    only_medicine_list,
    get_medicine,
    create,
    update,
    delete
)
from app.utils.response import success_response, error_response
from flask_jwt_extended import jwt_required

medicine_bp = Blueprint('medicine_bp', __name__, url_prefix='/medicines')

@medicine_bp.route('/', methods=['GET'])
def listar_medicinas():
    try:
        data = medicine_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
    
@medicine_bp.route('/list', methods=['GET'])
def listar_medicinas_nombres():
    try:
        data = only_medicine_list()
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@medicine_bp.route('/<int:medicine_id>', methods=['GET'])
def obtener_medicina(medicine_id):
    try:
        data = get_medicine(medicine_id)
        if not data:
            return error_response("Medicina no encontrada", 404)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)

@medicine_bp.route('/', methods=['POST'])
def crear_medicina():
    try:
        body = request.get_json()
        data = create(body)
        return success_response(data, 201)
    except Exception as e:
        return error_response(str(e), 500)

@medicine_bp.route("/<int:medicamento_id>", methods=["PUT"])
@jwt_required()
def update_medicamento(medicamento_id):
    data = request.json
    print(data)
    dinamico = request.args.get("dinamico") == "true"
    return update(medicamento_id, data, dinamico)

@medicine_bp.route('/<int:medicine_id>', methods=['DELETE'])
def eliminar_medicina(medicine_id):
    try:
        data = delete(medicine_id)
        return success_response(data, 200)
    except Exception as e:
        return error_response(str(e), 500)
