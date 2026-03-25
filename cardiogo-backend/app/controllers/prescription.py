from flask import current_app
from app.models import prescription as prescription_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        recetas = prescription_model.get_all()
        return success_response(recetas)
    except Exception as e:
        current_app.logger.error(f"Error listando recetas médicas: {e}")
        return error_response("Error interno al listar recetas médicas", 500)

def get_by_id(receta_id):
    try:
        receta = prescription_model.get_by_id(receta_id)
        if not receta:
            return error_response("Receta médica no encontrada", 404)
        return success_response(receta)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo receta médica: {e}")
        return error_response("Error interno al obtener receta médica", 500)

def get_prescriptions_by_patient(paciente_id):
    try:
        recetas = prescription_model.get_prescriptions_by_patient(paciente_id)
        return success_response(recetas)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo recetas médicas del paciente: {e}")
        return error_response("Error interno al obtener recetas médicas del paciente", 500)

def get_prescriptions_by_caregiver(id):
    try:
        recetas = prescription_model.get_prescriptions_by_cuidador(id)
        return success_response(recetas)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo recetas médicas del paciente: {e}")
        return error_response("Error interno al obtener recetas médicas del paciente", 500)

def create(data):
    try:
        receta_id = prescription_model.create(data)
        return success_response({"id": receta_id}, 201)
    except Exception as e:
        current_app.logger.error(f"Error creando receta médica: {e}")
        return error_response("Error interno al crear receta médica", 500)

def update(prescription_id, data, dinamico=False):
    try:
        if not prescription_model.get_by_id(prescription_id):
            return error_response("Patient not found", 404)
        if dinamico:
            prescription_model.update_dinamico(prescription_id, data)
        else:
            prescription_model.update_fijo(prescription_id, data)
        return success_response({"message": "Patient updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating patient: {e}")
        return error_response("Internal error updating patient", 500)

def delete(receta_id):
    try:
        if not prescription_model.get_by_id(receta_id):
            return error_response("Receta médica no encontrada", 404)
        prescription_model.delete(receta_id)
        return success_response({"message": "Receta médica eliminada correctamente"})
    except Exception as e:
        current_app.logger.error(f"Error eliminando receta médica: {e}")
        return error_response("Error interno al eliminar receta médica", 500)