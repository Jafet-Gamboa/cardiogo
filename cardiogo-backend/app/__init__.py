import logging
from flasgger import Swagger
from flask import Flask, jsonify, current_app
from flask_cors import CORS
from werkzeug.exceptions import HTTPException
from flask_jwt_extended import JWTManager
from app.routes.user import user_bp
from app.routes.auth import auth_bp
from app.routes.patient import patient_bp
from app.routes.prescription import prescription_bp
from app.routes.alert import alert_bp
from app.routes.medicine import medicine_bp
from app.routes.caregiver import caregiver_bp
from app.routes.administrative_staff import administrative_staff_bp
from app.routes.address import address_bp
from app.routes.doctor import doctor_bp
from app.routes.device import device_bp
from app.routes.alert_level import alert_level_bp
from app.routes.alert_type import alert_type_bp
from app.routes.normal_signs import normal_signs_bp
from app.routes.vital_signs import vital_signs_bp
from app.routes.caregiver_patient import caregiver_patient_bp
from app.routes.doctor_device import doctor_device_bp
from app.routes.prescribe_medications import prescribe_medication_bp
from app.routes.roles import roles_bp
from app.routes.notification import notification_bp
from app.routes.dataset import dataset_bp

from app.utils.response import error_response

jwt = JWTManager()

@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return error_response("Token de acceso requerido", 401)

@jwt.invalid_token_loader
def invalid_token_callback(error):
    current_app.logger.error(f"Token inválido: {error}")
    return error_response("Token inválido", 422)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return error_response("Token expirado", 401)

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return error_response("Token revocado", 401)

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    app.url_map.strict_slashes = False

    
    # Logging
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    logger = logging.getLogger(__name__)
    app.logger = logger
    
    # JWT
    jwt.init_app(app)

    # CORS
    # CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "PUT", "DELETE"], "allow_headers": "*"}})
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Swagger
    Swagger(app, template_file='docs/swagger.yml')
    
    api_prefix = "/cardio-go/v1"

    # Registrar blueprints
    app.register_blueprint(user_bp, url_prefix=f"{api_prefix}/users")
    app.register_blueprint(auth_bp, url_prefix=f"{api_prefix}/auth")
    app.register_blueprint(patient_bp, url_prefix=f"{api_prefix}/patients")
    app.register_blueprint(prescription_bp, url_prefix=f"{api_prefix}/prescriptions")
    app.register_blueprint(alert_bp, url_prefix=f"{api_prefix}/alerts")
    app.register_blueprint(medicine_bp, url_prefix=f"{api_prefix}/medicines")
    app.register_blueprint(caregiver_bp, url_prefix=f"{api_prefix}/caregivers")
    app.register_blueprint(administrative_staff_bp, url_prefix=f"{api_prefix}/administrative_staff")
    app.register_blueprint(address_bp, url_prefix=f"{api_prefix}/addresses")
    app.register_blueprint(doctor_bp, url_prefix=f"{api_prefix}/doctors")
    app.register_blueprint(device_bp, url_prefix=f"{api_prefix}/devices")
    app.register_blueprint(alert_level_bp, url_prefix=f"{api_prefix}/alert_levels")
    app.register_blueprint(alert_type_bp, url_prefix=f"{api_prefix}/alert_types")
    app.register_blueprint(normal_signs_bp, url_prefix=f"{api_prefix}/normal_signs")
    app.register_blueprint(vital_signs_bp, url_prefix=f'{api_prefix}/vital_signs')
    app.register_blueprint(caregiver_patient_bp, url_prefix=f'{api_prefix}/caregiver_patient')
    app.register_blueprint(doctor_device_bp, url_prefix=f'{api_prefix}/doctor_device')
    app.register_blueprint(prescribe_medication_bp, url_prefix=f'{api_prefix}/prescribe_medication')
    app.register_blueprint(roles_bp, url_prefix=f"{api_prefix}/roles")
    app.register_blueprint(notification_bp, url_prefix=f"{api_prefix}/notifications")
    app.register_blueprint(dataset_bp, url_prefix=f"{api_prefix}/dataset")
    
    # Manejo global de errores
    @app.errorhandler(Exception)
    def handle_exception(e):
        if isinstance(e, HTTPException):
            current_app.logger.error(f"HTTPException: {str(e)}")
            return error_response("Ocurrió un error en la solicitud.", e.code)
        else:
            current_app.logger.error(f"Error interno: {str(e)}")
            return error_response("Error interno del servidor.", 500)
    return app
