from flask import current_app, request
from app.models import prescribe_medications as prescribe_medications_model

def prescribe_medications_list_by_doctor(doctor_id):
    try:
        return prescribe_medications_model.get_all_by_doctor(doctor_id)
    except Exception as e:
        current_app.logger.error(f"Error listando las recetas: {e}")
        raise Exception("Error interno al obtener las recetas")
    
def prescribe_medications_list_new():
    try:
        return prescribe_medications_model.get_all_new()
    except Exception as e:
        current_app.logger.error(f"Error listando las recetas: {e}")
        raise Exception("Error interno al obtener las recetas")

def prescribe_medications_list_by_cuidador_id(cuidador_id):
    try:
        return prescribe_medications_model.get_receta_by_cuidador(cuidador_id)
    except Exception as e:
        current_app.logger.error(f"Error listando las recetas: {e}")
        raise Exception("Error interno al obtener las recetas")
    
def prescribe_medications_list_by_id(patient_id):
    try:
        return prescribe_medications_model.get_by_patient_id(patient_id)
    except Exception as e:
        current_app.logger.error(f"Error listando las recetas: {e}")
        raise Exception("Error interno al obtener las recetas")

def get_search_patient(query):
    try:
        return prescribe_medications_model.search_any_field(query)
    except Exception as e:
        current_app.logger.error(f"Error buscando al medico: {e}")
        raise Exception("Error interno al buscar al medico")

def create_prescription(data):
    """
    data: dict con la información de la receta y los medicamentos asociados
    """
    try:
        receta_id = prescribe_medications_model.create(data)
        return {"receta_id": receta_id}
    except Exception as e:
        current_app.logger.error(f"Error creando la receta: {e}")
        raise Exception("Error interno al crear la receta")
