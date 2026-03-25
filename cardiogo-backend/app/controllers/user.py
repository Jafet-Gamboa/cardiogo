import bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from flask import current_app, request, jsonify
from app.models import user as user_model
from app.utils.response import error_response, success_response
from app.models.doctor import get_by_usuario_id as doctor_get
from app.models.patient import get_by_usuario_id as patient_get
from app.models.caregiver import get_by_usuario_id as caregiver_get
from app.models.administrative_staff import get_by_usuario_id as admin_get
from app.models.user import get_basic_user, get_doctor_data, get_patient_data, get_caregiver_data

def user_list():
    try:
        usuarios = user_model.get_all()
        current_app.logger.info("Usuarios listados correctamente")
        return success_response(usuarios)
    except Exception as e:
        current_app.logger.error(f"Error listando usuarios: {e}")
        return error_response(str(e), 500)

def cards():
    try:
        cards = user_model.cards()
        current_app.logger.info("Informacion de cards listados correctamente")
        return success_response(cards, group=False)
    except Exception as e:
        current_app.logger.error(f"Error listando cards: {e}")
        return error_response(str(e), 500)

def user_id(user_id):
    try:
        usuario = user_model.get_by_id(user_id)
        current_app.logger.info("Usuario listado correctamente")
        return success_response(usuario)
    except Exception as e:
        current_app.logger.error(f"Error listando usuario: {e}")
        return error_response(str(e), 500)

def create(data):
    try:
        password = data.get("password")
        if not password:
            current_app.logger.warning("Intento de creación de usuario sin contraseña")
            return error_response("La contraseña es obligatoria", 400)

        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        data["password"] = hashed

        user_id = user_model.create(data)
        current_app.logger.info(f"Usuario creado con ID {user_id}")
        return success_response({"id": user_id}, 201)
    except Exception as e:
        current_app.logger.error(f"Error creando usuario: {e}")
        return error_response(str(e), 500)

def auth(data):
    try:
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            current_app.logger.warning("Login fallido por datos incompletos")
            return error_response("Email y contraseña son requeridos", 400)

        user = user_model.get_by_email(email)
        if not user:
            current_app.logger.warning(f"Login fallido: usuario {email} no encontrado")
            return error_response("Credenciales inválidas", 401)

        db_password = user["password"].strip()
        if bcrypt.checkpw(password.encode("utf-8"), db_password.encode("utf-8")):
            user.pop("password", None)
            user_id = user["id"]
            rol_id = user["rol_id"]
            
            role_data = None
            if rol_id == 2:
                role_data = doctor_get(user_id)
            elif rol_id == 3:
                role_data = patient_get(user_id)
            elif rol_id == 4:
                role_data = caregiver_get(user_id)
            elif rol_id == 5:
                role_data = admin_get(user_id)

            access_token = create_access_token(identity=str(user_id))
            refresh_token = create_refresh_token(identity=str(user_id))
            
            response = {
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user_id": user_id,
                "rol_id": rol_id,
                **(role_data if role_data else {})
            }
            
            return success_response(response, group=False)
        else:
            current_app.logger.warning(f"Login fallido: contraseña incorrecta para {email}")
            return error_response("Credenciales inválidas", 401)
    except Exception as e:
        current_app.logger.error(f"Error en autenticación: {e}")
        return error_response(str(e), 500)

def refresh(user_id):
    try:
        new_access_token = create_access_token(identity=user_id)
        current_app.logger.info(f"Token refrescado para usuario {user_id}")
        return success_response({"access_token": new_access_token})
    except Exception as e:
        current_app.logger.error(f"Error refrescando token: {e}")
        return error_response(str(e), 500)

def protected(user_id):
    try:
        current_app.logger.info(f"Acceso a endpoint protegido por usuario {user_id}")
        return success_response({"logged_in_as": user_id})
    except Exception as e:
        current_app.logger.error(f"Error en endpoint protegido: {e}")
        return error_response(str(e), 500)

def get_profile_user(user_id):
    user = get_basic_user(user_id)

    if not user:
        return None

    rol = user["rol_id"]

    extra_data = None

    if rol == 2:
        extra_data = get_doctor_data(user_id)

    elif rol == 3:
        extra_data = get_patient_data(user_id)

    elif rol == 4:
        extra_data = get_caregiver_data(user_id)

    elif rol == 5:
        extra_data = None

    return {
        "usuario": user,
        "detalles": extra_data,
        "rol": user["rol_descripcion"]
    }



def update_user(user_id):
    try:
        data = request.json
        result = user_model.update_user(user_id, data)
        if result:
            return success_response({"message": "Usuario actualizado correctamente"})
        else:
            return error_response("No se pudo actualizar el usuario", 400)
    except Exception as e:
        current_app.logger.error(f"Error actualizando usuario: {e}")
        return error_response(str(e), 500)

def update(usuario_id, data, dinamico=False):
    try:
        if not user_model.get_by_id(usuario_id):
            return error_response("User not found", 404)
        if dinamico:
            user_model.update_dinamico(usuario_id, data)
        else:
            user_model.update_fijo(usuario_id, data)
        return success_response({"message": "User updated successfully"})
    except Exception as e:
        current_app.logger.error(f"Error updating user: {e}")
        return error_response("Internal error updating user", 500)
