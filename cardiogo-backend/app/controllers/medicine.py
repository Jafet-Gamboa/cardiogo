from flask import current_app
from app.models import medicine as medicine_model
from app.utils.response import success_response, error_response

def medicine_list():
    try:
        return medicine_model.get_all()
    except Exception as e:
        current_app.logger.error(f"Error listando medicinas: {e}")
        raise Exception("Error interno al obtener medicinas")

def only_medicine_list():
    try:
        return medicine_model.get_all_medicines()
    except Exception as e:
        current_app.logger.error(f"Error listando medicinas: {e}")
        raise Exception("Error interno al obtener medicinas")

def get_medicine(medicine_id):
    try:
        return medicine_model.get_by_id(medicine_id)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo medicina: {e}")
        raise Exception("Error interno al obtener medicina")

def create(data):
    try:
        required = ["nombre", "concentracion", "via_administracion", "principio_activo", "forma_farmaceutica"]

        missing_fields = [f for f in required if f not in data or data[f] in (None, "", " ")]
        if missing_fields:
            missing_str = ", ".join(missing_fields)
            # Lanzamos un ValueError para que el controlador lo maneje
            raise ValueError(f"Faltan los siguientes campos requeridos: {missing_str}")

        med_id = medicine_model.create(data)
        return {"id": med_id}
    
    except ValueError as ve:
        current_app.logger.warning(f"Validación fallida al crear medicina: {ve}")
        raise ve
    
    except Exception as e:
        current_app.logger.error(f"Error creando medicina: {e}")
        raise Exception("Error interno al crear medicina")

def update(medicamento_id, data, dinamico=False):
    try:
        if not medicine_model.get_by_id_medicine(medicamento_id):
            return error_response("Medicine not found", 404)
        if dinamico:
            print("entro dinamico")
            medicine_model.update_dinamico(medicamento_id, data)
        else:
            medicine_model.update_fijo(medicamento_id, data)
        return success_response({"message": "Medicine updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating medicine: {e}")
        return error_response("Internal error updating medicine", 500)

def delete(medicine_id):
    try:
        if not medicine_model.get_by_id(medicine_id):
            raise ValueError("Medicina no encontrada")
        medicine_model.delete(medicine_id)
        return {"message": "Medicina eliminada"}
    except Exception as e:
        current_app.logger.error(f"Error eliminando medicina: {e}")
        raise Exception("Error interno al eliminar medicina")
