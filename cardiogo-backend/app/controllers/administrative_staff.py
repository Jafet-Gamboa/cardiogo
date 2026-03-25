from flask import current_app
from app.models import administrative_staff as staff_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = staff_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing administrative staff: {e}")
        return error_response("Internal error listing administrative staff", 500)

def get_by_id(staff_id):
    try:
        data = staff_model.get_by_id(staff_id)
        if not data:
            return error_response("Administrative staff not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting administrative staff: {e}")
        return error_response("Internal error getting administrative staff", 500)

def count():
    try:
        data = {"total": staff_model.count()}
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting administrative staff: {e}")
        return error_response("Internal error getting administrative staff", 500)

def create(data):
    try:
        # Campos requeridos
        required = ["usuario_id", "telefono_interno"]
        # Detectar los campos faltantes o vacíos
        missing_fields = [f for f in required if f not in data or data[f] in (None, "", " ")]
        
        if missing_fields:
            missing_str = ", ".join(missing_fields)
            return error_response(
                f"Faltan los siguientes campos requeridos: {missing_str}",
                400
            )
        
        # Crear registro si todo está correcto
        staff_id = staff_model.create(data)
        return success_response({"id": staff_id}, 201)
    
    except Exception as e:
        current_app.logger.error(f"Error creating administrative staff: {e}")
        return error_response("Error interno al crear el personal administrativo", 500)

    


def update(personal_id, data, dinamico=False):
    try:
        if not staff_model.get_by_id(personal_id):
            return error_response("Administrative staff not found", 404)
        if dinamico:
            staff_model.update_dinamico(personal_id, data)
        else:
            staff_model.update_fijo(personal_id, data)
        return success_response({"message": "Administrative staff updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating administrative staff: {e}")
        return error_response("Internal error updating administrative staff", 500)

def delete(staff_id):
    try:
        if not staff_model.get_by_id(staff_id):
            return error_response("Administrative staff not found", 404)
        staff_model.delete(staff_id)
        return success_response({"message": "Administrative staff deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting administrative staff: {e}")
        return error_response("Internal error deleting administrative staff", 500)