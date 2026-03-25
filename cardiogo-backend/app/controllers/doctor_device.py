from flask import current_app
from app.models import doctor_device as doctor_device_model

def doctor_device_list():
    try:
        return doctor_device_model.get_all()
    except Exception as e:
        current_app.logger.error(f"Error listando los nombres: {e}")
        raise Exception("Error interno al obtener los nombres")

def get_search_doctor(query):
    try:
        return doctor_device_model.search_any_field(query)
    except Exception as e:
        current_app.logger.error(f"Error buscando al medico: {e}")
        raise Exception("Error interno al buscar al medico")