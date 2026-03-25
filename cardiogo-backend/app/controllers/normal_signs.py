from flask import current_app
from app.models import normal_signs as normal_signs_model
from app.utils.response import success_response, error_response

def normal_signs_list():
    try:
        return normal_signs_model.get_all()
    except Exception as e:
        current_app.logger.error(f"Error listando los rangos normales: {e}")
        raise Exception("Error interno al obtener los rangos normales")

def get_normal_signs(normal_signs_id):
    try:
        return normal_signs_model.get_by_id(normal_signs_id)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo el rango normal: {e}")
        raise Exception("Error interno al obtener el rango normal")

def get_normal_signs_list_patient(id):
    try:
        return normal_signs_model.get_by_patient(id)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo el signo vital: {e}")
        raise Exception("Error interno al obtener el signo vital")

def get_normal_signs_list_caregiver(id):
    try:
        return normal_signs_model.get_by_cuidador(id)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo el signo vital: {e}")
        raise Exception("Error interno al obtener el signo vital")

def update(rango_id, data, dinamico=False):
    try:
        if not normal_signs_model.get_by_id(rango_id):
            return error_response("Normal range not found", 404)
        if dinamico:
            normal_signs_model.update_dinamico(rango_id, data)
        else:
            normal_signs_model.update_fijo(rango_id, data)
        return success_response({"message": "Normal range updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating normal range: {e}")
        return error_response("Internal error updating normal range", 500)
    
def create(data):
    try:
        required = ["valor_minimo","valor_maximo"]
        for f in required:
            if f not in data:
                raise ValueError(f"El campo '{f}' es obligatorio")
        med_id = normal_signs_model.create(data)
        return {"id": med_id}
    except Exception as e:
        current_app.logger.error(f"Error creando medicina: {e}")
        raise Exception("Error interno al crear medicina")