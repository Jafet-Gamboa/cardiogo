from flask import current_app
from app.models import caregiver as caregiver_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = caregiver_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing caregivers: {e}")
        return error_response("Internal error listing caregivers", 500)

def get_by_id(caregiver_id):
    try:
        data = caregiver_model.get_by_id(caregiver_id)
        if not data:
            return error_response("Caregiver not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting caregiver: {e}")
        return error_response("Internal error getting caregiver", 500)

def get_paciente_by_usuario(usuario_id):
    cuidador = caregiver_model.get_by_usuario_id(usuario_id)
    if not cuidador:
        return error_response("Caregiver not found 1", 404)
    cuidador_id = cuidador["cuidador_id"]
    detalle = caregiver_model.get_caregiver_by_id(cuidador_id)
    if not detalle:
        return error_response("Caregiver not found 2", 404)
    return success_response(detalle)

def create(data):
    try:
        # Campos requeridos
        required = ["relacion_paciente", "usuario_id"]
        # Verificar campos faltantes o vacíos
        missing_fields = [f for f in required if f not in data or data[f] in (None, "", " ")]
        
        if missing_fields:
            missing_str = ", ".join(missing_fields)
            return error_response(
                f"Faltan los siguientes campos requeridos: {missing_str}",
                400
            )
        
        # Crear registro si todo está correcto
        caregiver_id = caregiver_model.create(data)
        return success_response({"id": caregiver_id}, 201)
    
    except Exception as e:
        current_app.logger.error(f"Error creating caregiver: {e}")
        return error_response("Error interno al crear el cuidador", 500)


def update(caregiver_id, data, dinamico=False):
    try:
        # if not caregiver_model.get_by_id(caregiver_id):
        #     return error_response("Caregiver not found", 404)
        if dinamico:
            caregiver_model.update_dinamico(caregiver_id, data)
        else:
            caregiver_model.update_fijo(caregiver_id, data)
        return success_response({"message": "Caregiver updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating caregiver: {e}")
        return error_response("Internal error updating caregiver", 500)

def delete(caregiver_id):
    try:
        if not caregiver_model.get_by_id(caregiver_id):
            return error_response("Caregiver not found", 404)
        caregiver_model.delete(caregiver_id)
        return success_response({"message": "Caregiver deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting caregiver: {e}")
        return error_response("Internal error deleting caregiver", 500)

def count():
    try:
        result = caregiver_model.count()
        return success_response({"total_caregivers": result["total_cuidadores"] if result else 0}, group=False)
    except Exception as e:
        current_app.logger.error(f"Error counting caregivers: {e}")
        return error_response("Internal error counting caregivers", 500)