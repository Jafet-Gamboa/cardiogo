from flask import Blueprint, request
from app.controllers import doctor as doctor_controller
from flask_jwt_extended import jwt_required

doctor_bp = Blueprint('doctor', __name__)

@doctor_bp.route("/", methods=["GET"])
@jwt_required()
def list_doctors():
    return doctor_controller.get_all()

@doctor_bp.route("/<int:doctor_id>", methods=["GET"])
@jwt_required()
def get_doctor(doctor_id):
    return doctor_controller.get_by_id(doctor_id)

@doctor_bp.route("/pacientes/<int:doctor_id>", methods=["GET"])
@jwt_required()
def get_paciente_doctor(doctor_id):
    return doctor_controller.get_patients(doctor_id)

@doctor_bp.route("/", methods=["POST"])
@jwt_required()
def create_doctor():
    data = request.json
    print(" Datos recibidos en backend:", data)
    return doctor_controller.create(data)

@doctor_bp.route("/<int:doctor_id>", methods=["PUT"])
@jwt_required()
def update_medico(doctor_id):
    data = request.json
    dinamico = request.args.get("dinamico") == "true"
    return doctor_controller.update(doctor_id, data, dinamico)

@doctor_bp.route("/<int:doctor_id>", methods=["DELETE"])
@jwt_required()
def delete_doctor(doctor_id):
    return doctor_controller.delete(doctor_id)

# ============================================================
# ENDPOINTS PARA DASHBOARD GENERAL DEL DOCTOR
# ============================================================

@doctor_bp.route("/<int:doctor_id>/dashboard/pacientes_en_riesgo", methods=["GET"])
@jwt_required()
def dash_pacientes_en_riesgo(doctor_id):
    return doctor_controller.pacientes_en_riesgo(doctor_id)

@doctor_bp.route("/<int:doctor_id>/dashboard/alertas_hoy", methods=["GET"])
@jwt_required()
def dash_alertas_hoy(doctor_id):
    return doctor_controller.alertas_hoy(doctor_id)

@doctor_bp.route("/<int:doctor_id>/dashboard/dispositivos_activos", methods=["GET"])
@jwt_required()
def dash_dispositivos_activos(doctor_id):
    return doctor_controller.dispositivos_activos(doctor_id)

@doctor_bp.route("/<int:doctor_id>/dashboard/pacientes_criticos", methods=["GET"])
@jwt_required()
def dash_pacientes_criticos(doctor_id):
    return doctor_controller.pacientes_criticos(doctor_id)

@doctor_bp.route("/<int:doctor_id>/dashboard/actividad_sistema", methods=["GET"])
@jwt_required()
def dash_actividad_sistema(doctor_id):
    return doctor_controller.actividad_sistema(doctor_id)

@doctor_bp.route("/<int:doctor_id>/dashboard/distribucion_edad", methods=["GET"])
@jwt_required()
def dash_distribucion_edad(doctor_id):
    return doctor_controller.distribucion_edad(doctor_id)

@doctor_bp.route("/<int:doctor_id>/dashboard/tipos_alerta_frecuentes", methods=["GET"])
@jwt_required()
def dash_tipos_alerta_frecuentes(doctor_id):
    return doctor_controller.tipos_alerta_frecuentes(doctor_id)


# ============================================================
# ENDPOINTS PARA DASHBOARD INDIVIDUAL DEL PACIENTE
# ============================================================

@doctor_bp.route("/<int:doctor_id>/pacientes/<int:paciente_id>/evolucion_ritmo", methods=["GET"])
@jwt_required()
def dash_evolucion_ritmo(doctor_id, paciente_id):
    return doctor_controller.evolucion_ritmo(doctor_id, paciente_id)

@doctor_bp.route("/<int:doctor_id>/pacientes/<int:paciente_id>/evolucion_oxigenacion", methods=["GET"])
@jwt_required()
def dash_evolucion_oxigenacion(doctor_id, paciente_id):
    return doctor_controller.evolucion_oxigenacion(doctor_id, paciente_id)

@doctor_bp.route("/<int:doctor_id>/pacientes/<int:paciente_id>/evolucion_temperatura", methods=["GET"])
@jwt_required()
def dash_evolucion_temperatura(doctor_id, paciente_id):
    return doctor_controller.evolucion_temperatura(doctor_id, paciente_id)

@doctor_bp.route("/<int:doctor_id>/pacientes/<int:paciente_id>/alertas_por_dia", methods=["GET"])
@jwt_required()
def dash_alertas_por_dia(doctor_id, paciente_id):
    return doctor_controller.alertas_por_dia(doctor_id, paciente_id)

@doctor_bp.route("/<int:doctor_id>/pacientes/<int:paciente_id>/ritmo_por_hora", methods=["GET"])
@jwt_required()
def dash_ritmo_por_hora(doctor_id, paciente_id):
    return doctor_controller.ritmo_por_hora(doctor_id, paciente_id)
