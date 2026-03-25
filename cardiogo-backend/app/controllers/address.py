from flask import current_app
from app.models import address as address_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = address_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing addresses: {e}")
        return error_response("Internal error listing addresses", 500)

def get_by_id(address_id):
    try:
        data = address_model.get_by_id(address_id)
        if not data:
            return error_response("Address not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting address: {e}")
        return error_response("Internal error getting address", 500)

def create(data):
    try:
        required = ["calle", "numero_exterior", "colonia", "codigo_postal"]
        # Filtrar los campos faltantes
        missing_fields = [f for f in required if f not in data or data[f] in (None, "", " ")]
        
        if missing_fields:
            # Generar mensaje con los campos faltantes
            missing_str = ", ".join(missing_fields)
            return error_response(
                f"Faltan los siguientes campos requeridos: {missing_str}", 
                400
            )
        
        # Crear registro si todo está correcto
        address_id = address_model.create(data)
        return success_response({"id": address_id}, 201)
        
    except Exception as e:
        current_app.logger.error(f"Error creating address: {e}")
        return error_response("Error interno al crear la dirección", 500)


# def update(address_id, data):
#     try:
#         if not address_model.get_by_id(address_id):
#             return error_response("Address not found", 404)
#         address_model.update(address_id, data)
#         return success_response({"message": "Address updated successfully"})
#     except Exception as e:
#         current_app.logger.error(f"Error updating address: {e}")
#         return error_response("Internal error updating address", 500)

def update(address_id, data, dinamico=False):
    try:
        if not address_model.get_by_id(address_id):
            return error_response("Address not found", 404)
        if dinamico:
            address_model.update_dinamico(address_id, data)
        else:
            address_model.update_fijo(address_id, data)
        return success_response({"message": "Address updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating address: {e}")
        return error_response("Internal error updating address", 500)

def delete(address_id):
    try:
        if not address_model.get_by_id(address_id):
            return error_response("Address not found", 404)
        address_model.delete(address_id)
        return success_response({"message": "Address deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting address: {e}")
        return error_response("Internal error deleting address", 500)