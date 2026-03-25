from flask import current_app
from app.models import doctor as doctor_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = doctor_model.get_all()
        return success_response(data, group=False)
    except Exception as e:
        current_app.logger.error(f"Error listing doctors: {e}")
        return error_response("Internal error listing doctors", 500)

def get_by_id(doctor_id):
    try:
        data = doctor_model.get_by_id(doctor_id)
        if not data:
            return error_response("Doctor not found", 404)
        return success_response(data, group=False)
    except Exception as e:
        current_app.logger.error(f"Error getting doctor: {e}")
        return error_response("Internal error getting doctor", 500)

def create(data):
    try:
        # Campos requeridos
        required = ["cedula_profesional", "especialidad", "usuario_id"]
        # Detectar campos faltantes o vacíos
        missing_fields = [f for f in required if f not in data or data[f] in (None, "", " ")]
        
        if missing_fields:
            missing_str = ", ".join(missing_fields)
            return error_response(
                f"Faltan los siguientes campos requeridos: {missing_str}",
                400
            )
        
        # Crear registro si todo está correcto
        doctor_id = doctor_model.create(data)
        return success_response({"id": doctor_id}, 201)
    
    except Exception as e:
        current_app.logger.error(f"Error creating doctor: {e}")
        return error_response("Error interno al crear el doctor", 500)


def update(medico_id, data, dinamico=False):
    try:
        if not doctor_model.get_by_id(medico_id):
            return error_response("Doctor not found", 404)
        if dinamico:
            doctor_model.update_dinamico(medico_id, data)
        else:
            doctor_model.update_fijo(medico_id, data)
        return success_response({"message": "Doctor updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating doctor: {e}")
        return error_response("Internal error updating doctor", 500)

def delete(doctor_id):
    try:
        if not doctor_model.get_by_id(doctor_id):
            return error_response("Doctor not found", 404)
        doctor_model.delete(doctor_id)
        return success_response({"message": "Doctor deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting doctor: {e}")
        return error_response("Internal error deleting doctor", 500)

# ============================================================
# 🔥 CONSULTAS PARA EL DASHBOARD GENERAL DEL DOCTOR
# ============================================================

def pacientes_en_riesgo(doctor_id):
    try:
        data = doctor_model.pacientes_en_riesgo(doctor_id)
        return success_response(data, group=False)
    except Exception as e:
        current_app.logger.error(f"Error getting pacientes_en_riesgo: {e}")
        return error_response("Internal error getting pacientes_en_riesgo", 500)


def alertas_hoy(doctor_id):
    try:
        data = doctor_model.alertas_hoy(doctor_id)
        return success_response(data, group=False)
    except Exception as e:
        current_app.logger.error(f"Error getting alertas_hoy: {e}")
        return error_response("Internal error getting alertas_hoy", 500)


def dispositivos_activos(doctor_id):
    try:
        data = doctor_model.dispositivos_activos(doctor_id)
        return success_response(data, group=False)
    except Exception as e:
        current_app.logger.error(f"Error getting dispositivos_activos: {e}")
        return error_response("Internal error getting dispositivos_activos", 500)


def pacientes_criticos(doctor_id):
    try:
        data = doctor_model.pacientes_criticos(doctor_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting pacientes_criticos: {e}")
        return error_response("Internal error getting pacientes_criticos", 500)


def actividad_sistema(doctor_id):
    try:
        data = doctor_model.actividad_sistema(doctor_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting actividad_sistema: {e}")
        return error_response("Internal error getting actividad_sistema", 500)


def distribucion_edad(doctor_id):
    try:
        data = doctor_model.distribucion_edad(doctor_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting distribucion_edad: {e}")
        return error_response("Internal error getting distribucion_edad", 500)


def tipos_alerta_frecuentes(doctor_id):
    try:
        data = doctor_model.tipos_alerta_frecuentes(doctor_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting tipos_alerta_frecuentes: {e}")
        return error_response("Internal error getting tipos_alerta_frecuentes", 500)





# ============================================================
# 🔥 CONSULTAS INDIVIDUALES DE PACIENTE
# ============================================================

def evolucion_ritmo(doctor_id, paciente_id):
    try:
        data = doctor_model.evolucion_ritmo(doctor_id, paciente_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting evolucion_ritmo: {e}")
        return error_response("Internal error getting evolucion_ritmo", 500)


def evolucion_oxigenacion(doctor_id, paciente_id):
    try:
        data = doctor_model.evolucion_oxigenacion(doctor_id, paciente_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting evolucion_oxigenacion: {e}")
        return error_response("Internal error getting evolucion_oxigenacion", 500)


def evolucion_temperatura(doctor_id, paciente_id):
    try:
        data = doctor_model.evolucion_temperatura(doctor_id, paciente_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting evolucion_temperatura: {e}")
        return error_response("Internal error getting evolucion_temperatura", 500)


def alertas_por_dia(doctor_id, paciente_id):
    try:
        data = doctor_model.alertas_por_dia(doctor_id, paciente_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting alertas_por_dia: {e}")
        return error_response("Internal error getting alertas_por_dia", 500)


def ritmo_por_hora(doctor_id, paciente_id):
    try:
        data = doctor_model.ritmo_por_hora(doctor_id, paciente_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting ritmo_por_hora: {e}")
        return error_response("Internal error getting ritmo_por_hora", 500)

def get_patients(doctor_id):
    try:
        data = doctor_model.get_patients_by_medico(doctor_id)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting patients: {e}")
        return error_response("Internal error getting patients", 500)
