from flask import current_app
from app.models import alert as alert_model
from app.utils.response import success_response, error_response

def alert_list():
    try:
        alertas = alert_model.get_all()
        return alertas
    except Exception as e:
        current_app.logger.error(f"Error listando alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_alert(alert_id):
    try:
        alerta = alert_model.get_by_id(alert_id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def get_alert_no_read_by_patient(id):
    try:
        alerta = alert_model.get_no_read_by_patient(id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def get_alert_read_by_patient(id):
    try:
        alerta = alert_model.get_read_by_patient(id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def get_alert_no_read_count_by_patient(id):
    try:
        alerta = alert_model.get_no_read_count_by_patient(id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def get_alert_no_read_by_caregiver(id):
    try:
        alerta = alert_model.get_no_read_by_caregiver(id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def get_alert_read_by_caregiver(id):
    try:
        alerta = alert_model.get_read_by_caregiver(id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def get_alert_no_read_count_by_caregiver(id):
    try:
        alerta = alert_model.get_no_read_count_by_caregiver(id)
        if not alerta:
            return None
        return alerta
    except Exception as e:
        current_app.logger.error(f"Error obteniendo alerta: {e}")
        raise Exception("Error interno al obtener alerta")

def create(data):
    try:
        required = ["tipo_id"]
        for f in required:
            if f not in data:
                raise ValueError(f"El campo '{f}' es obligatorio")
        alert_id = alert_model.create(data)
        return {"id": alert_id}
    except Exception as e:
        current_app.logger.error(f"Error creando alerta: {e}")
        raise Exception("Error interno al crear alerta")

def update(alert_id, data, dinamico=False):
    try:
        if not alert_model.get_by_id(alert_id):
            return error_response("Alert not found", 404)
        if dinamico:
            alert_model.update_dinamico(alert_id, data)
        else:
            alert_model.update_fijo(alert_id, data)
        return success_response({"message": "Alert updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating alert: {e}")
        return error_response("Internal error updating alert", 500)

def update_leido_p(alert_id):
    try:
        alert_model.update_paciente(alert_id)
        return success_response({"message": "Alert updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating alert: {e}")
        return error_response("Internal error updating alert", 500)

def update_leido_c(alert_id):
    try:
        alert_model.update_cuidador(alert_id)
        return success_response({"message": "Alert updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating alert: {e}")
        return error_response("Internal error updating alert", 500)

def delete(alert_id):
    try:
        if not alert_model.get_by_id(alert_id):
            raise ValueError("Alerta no encontrada")
        alert_model.delete(alert_id)
        return {"message": "Alerta eliminada"}
    except Exception as e:
        current_app.logger.error(f"Error eliminando alerta: {e}")
        raise Exception("Error interno al eliminar alerta")
