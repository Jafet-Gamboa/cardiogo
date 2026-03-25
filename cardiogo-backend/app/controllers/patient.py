from flask import current_app
from app.models import patient as patient_model
from app.utils.response import success_response, error_response

def patient_list():
    """Listar todos los pacientes"""
    try:
        return success_response(patient_model.get_all())
    except Exception as e:
        current_app.logger.error(f"Error listando pacientes: {e}")
        raise Exception("Error interno al obtener pacientes")

def get_patient(patient_id):
    """Obtener un paciente por su ID"""
    try:
        paciente = patient_model.get_by_id(patient_id)
        return success_response(paciente)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo paciente: {e}")
        raise Exception("Error interno al obtener paciente")
    
def get_complete_patient(patient_id):
    """Obtener un paciente completo por su ID"""
    try:
        paciente = patient_model.get_patientCompleteById(patient_id)
        return success_response(paciente)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo paciente: {e}")
        raise Exception("Error interno al obtener paciente")

def create(data):
    """Crear un nuevo paciente"""
    try:
        required_fields = ["usuario_id", "sexo", "fecha_nacimiento"]
        for field in required_fields:
            if field not in data or not data[field]:
                raise ValueError(f"El campo '{field}' es obligatorio")
        patient_id = patient_model.create(data)
        return {"id": patient_id}
    except Exception as e:
        current_app.logger.error(f"Error creando paciente: {e}")
        raise Exception("Error interno al crear paciente")

def update(paciente_id, data, dinamico=False):
    try:
        if not patient_model.get_by_id(paciente_id):
            return error_response("Patient not found", 404)
        if dinamico:
            patient_model.update_dinamico(paciente_id, data)
        else:
            patient_model.update_fijo(paciente_id, data)
        return success_response({"message": "Patient updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating patient: {e}")
        return error_response("Internal error updating patient", 500)

def delete(patient_id):
    """Eliminar un paciente"""
    try:
        if not patient_model.get_by_id(patient_id):
            raise ValueError("Paciente no encontrado")
        patient_model.delete(patient_id)
        return {"message": "Paciente eliminado correctamente"}
    except Exception as e:
        current_app.logger.error(f"Error eliminando paciente: {e}")
        raise Exception("Error interno al eliminar paciente")