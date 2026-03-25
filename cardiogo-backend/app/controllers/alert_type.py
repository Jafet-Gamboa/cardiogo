from flask import current_app
from app.models import alert_type as alert_type_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = alert_type_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing alert types: {e}")
        return error_response("Internal error listing alert types", 500)

def get_by_id(type_id):
    try:
        data = alert_type_model.get_by_id(type_id)
        if not data:
            return error_response("Alert type not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting alert type: {e}")
        return error_response("Internal error getting alert type", 500)

def get_types_count_by_patient(patient_id):
    try:
        result = alert_type_model.get_types_count_by_patient(patient_id)
        return success_response(result, group=False)
    except Exception as e:
        current_app.logger.error(f"Error getting alert types count for patient: {e}")
        return error_response("Internal error getting alert types count", 500)
    
def create(data):
    try:
        type_id = alert_type_model.create(data)
        return success_response({"id": type_id}, 201)
    except Exception as e:
        current_app.logger.error(f"Error creating alert type: {e}")
        return error_response("Internal error creating alert type", 500)

def update(alert_type_id, data, dinamico=False):
    try:
        if not alert_type_model.get_by_id(alert_type_id):
            return error_response("Alert type not found", 404)
        if dinamico:
            alert_type_model.update_dinamico(alert_type_id, data)
        else:
            alert_type_model.update_fijo(alert_type_id, data)
        return success_response({"message": "Alert type updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating alert type: {e}")
        return error_response("Internal error updating alert type", 500)

def delete(type_id):
    try:
        if not alert_type_model.get_by_id(type_id):
            return error_response("Alert type not found", 404)
        alert_type_model.delete(type_id)
        return success_response({"message": "Alert type deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting alert type: {e}")
        return error_response("Internal error deleting alert type", 500)