from flask import current_app
from app.models import roles as roles_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = roles_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listando roles: {e}")
        return error_response("Error interno al listar roles", 500)

def get_by_id(role_id):
    try:
        data = roles_model.get_by_id(role_id)
        if not data:
            return error_response("Rol no encontrado", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo rol: {e}")
        return error_response("Error interno al obtener rol", 500)

def create(data):
    try:
        role_id = roles_model.create(data)
        return success_response({"id": role_id}, 201)
    except Exception as e:
        current_app.logger.error(f"Error creando rol: {e}")
        return error_response("Error interno al crear rol", 500)

def update(role_id, data, dinamico=False):
    try:
        if not roles_model.get_by_id(role_id):
            return error_response("Role not found", 404)
        if dinamico:
            roles_model.update_dinamico(role_id, data)
        else:
            roles_model.update_fijo(role_id, data)
        return success_response({"message": "Role updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating role: {e}")
        return error_response("Internal error updating role", 500)

def delete(role_id):
    try:
        if not roles_model.get_by_id(role_id):
            return error_response("Rol no encontrado", 404)
        roles_model.delete(role_id)
        return success_response({"message": "Rol eliminado correctamente"})
    except Exception as e:
        current_app.logger.error(f"Error eliminando rol: {e}")
        return error_response("Error interno al eliminar rol", 500)