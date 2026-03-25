from flask import current_app
from app.models import caregiver_patient as caregiver_patient_model
from app.utils.response import success_response, error_response

def caregiver_patient_list():
    try:
        return caregiver_patient_model.get_all()
    except Exception as e:
        current_app.logger.error(f"Error listando los nombres: {e}")
        raise Exception("Error interno al obtener los nombres")

def caregiver_patient_information(user_patient_id):
    try:
        return caregiver_patient_model.get_all_information_caregiver_patient(user_patient_id)
    except Exception as e:
        current_app.logger.error(f"Error listando la informacion: {e}")
        raise Exception("Error interno al obtener la informacion")
    
def get_search_patient(query):
    try:
        return caregiver_patient_model.search_any_field(query)
    except Exception as e:
        current_app.logger.error(f"Error buscando el paciente: {e}")
        raise Exception("Error interno al buscar el paciente")
    
def search_patient_by_id(query):
    try:
        return caregiver_patient_model.get_caregiver_patient_by_id(query)
    except Exception as e:
        current_app.logger.error(f"Error buscando el id del paciente: {e}")
        raise Exception("Error interno al buscar el paciente con id")
    
def create(data):
    try:
        # Campos requeridos
        required = ["cuidador_id", "paciente_id", "fecha_asignacion", "estado"]
        # Verificar campos faltantes o vacíos
        missing_fields = [f for f in required if f not in data or data[f] in (None, "", " ")]
        
        if missing_fields:
            missing_str = ", ".join(missing_fields)
            return error_response(
                f"Faltan los siguientes campos requeridos: {missing_str}",
                400
            )
        
        # Crear registro si todo está correcto
        caregiver_patient = caregiver_patient_model.create(data)
        return success_response({"id": caregiver_patient}, 201)
    
    except Exception as e:
        current_app.logger.error(f"Error creating caregiver_patient: {e}")
        return error_response("Error interno al crear el caregiver_patient", 500)