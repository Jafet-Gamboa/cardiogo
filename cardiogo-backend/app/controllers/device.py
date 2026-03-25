from flask import current_app
from app.models import device as device_model
from app.utils.response import success_response, error_response

def get_all():
    try:
        data = device_model.get_all()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing devices: {e}")
        return error_response("Internal error listing devices", 500)
    
def get_all_devicess():
    try:
        data = device_model.get_all_devices()
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error listing devices: {e}")
        return error_response("Internal error listing devices", 500)

def get_by_id(device_id):
    try:
        data = device_model.get_by_id(device_id)
        if not data:
            return error_response("Device not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting device: {e}")
        return error_response("Internal error getting device", 500)
    
def get_by_cuidador_id(cuidador_id):
    try:
        data = device_model.get_by_cuidador_id(cuidador_id)
        if not data:
            return error_response("Device not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting device: {e}")
        return error_response("Internal error getting device", 500)
    
def get_by_patient_id(patient_id):
    try:
        data = device_model.get_by_patient_id(patient_id)
        if not data:
            return error_response("Device not found", 404)
        return success_response(data)
    except Exception as e:
        current_app.logger.error(f"Error getting device: {e}")
        return error_response("Internal error getting device", 500)


def create(data):
    try:
        device_id = device_model.create(data)
        return success_response({"id": device_id}, 201)
    except Exception as e:
        current_app.logger.error(f"Error creating device: {e}")
        return error_response("Internal error creating device", 500)

def update(dispositivo_id, data, dinamico=False):
    try:
        if not device_model.get_by_id(dispositivo_id):
            return error_response("Device not found", 404)
        if dinamico:
            device_model.update_dinamico(dispositivo_id, data)
        else:
            device_model.update_fijo(dispositivo_id, data)
        return success_response({"message": "Device updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating device: {e}")
        return error_response("Internal error updating device", 500)

def delete(device_id):
    try:
        if not device_model.get_by_id(device_id):
            return error_response("Device not found", 404)
        device_model.delete(device_id)
        return success_response({"message": "Device deleted successfully"})
    except Exception as e:
        current_app.logger.error(f"Error deleting device: {e}")
        return error_response("Internal error deleting device", 500)