from flask import current_app
from app.models import alert_level as alert_level_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = alert_level_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing alert levels: {e}")
        return error_response("Internal error listing alert levels", 500)

def get_by_id(level_id):
    try:
        data = alert_level_model.get_by_id(level_id)
        if not data:
            return error_response("Alert level not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting alert level: {e}")
        return error_response("Internal error getting alert level", 500)

def create(data):
    try:
        level_id = alert_level_model.create(data)
        return success_response({"id": level_id}, 201)
    except Exception as e:
        current_app.logger.error(f"Error creating alert level: {e}")
        return error_response("Internal error creating alert level", 500)

def update(alert_level_id, data, dinamico=False):
    try:
        if not alert_level_model.get_by_id(alert_level_id):
            return error_response("Alert level not found", 404)
        if dinamico:
            alert_level_model.update_dinamico(alert_level_id, data)
        else:
            alert_level_model.update_fijo(alert_level_id, data)
        return success_response({"message": "Alert level updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating alert level: {e}")
        return error_response("Internal error updating alert level", 500)

def delete(level_id):
    try:
        if not alert_level_model.get_by_id(level_id):
            return error_response("Alert level not found", 404)
        alert_level_model.delete(level_id)
        return success_response({"message": "Alert level deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting alert level: {e}")
        return error_response("Internal error deleting alert level", 500)

def get_levels_count_by_patient(patient_id):
    try:
        result = alert_level_model.get_levels_count_by_patient(patient_id)
        return success_response(result, group=False)
    except Exception as e:
        current_app.logger.error(f"Error getting alert levels count for patient: {e}")
        return error_response("Internal error getting alert levels count", 500)
