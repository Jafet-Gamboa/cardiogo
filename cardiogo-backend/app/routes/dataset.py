from flask import Blueprint, request
from app.utils.response import success_response, error_response

from app.controllers.dataset import (
    entrenar_modelo,
    grafica_output_controller,
    grafica_histogramas_controller,
    grafica_correlacion_controller,
    grafica_confusion_controller,
    grafica_roc_controller,
    predecir_controller
)

dataset_bp = Blueprint('dataset', __name__)

@dataset_bp.route("/entrenar", methods=["POST"])
def endpoint_entrenar():
    try:
        data = entrenar_modelo()
        return success_response(data)
    except Exception as e:
        return error_response(str(e), 500)

@dataset_bp.route("/grafica/distribucion_output")
def grafica_output():
    try:
        return grafica_output_controller()
    except Exception as e:
        return error_response(str(e), 500)

@dataset_bp.route("/grafica/histogramas")
def grafica_histogramas():
    try:
        return grafica_histogramas_controller()
    except Exception as e:
        return error_response(str(e), 500)

@dataset_bp.route("/grafica/correlacion")
def grafica_correlacion():
    try:
        return grafica_correlacion_controller()
    except Exception as e:
        return error_response(str(e), 500)

@dataset_bp.route("/grafica/matriz_confusion")
def grafica_confusion():
    try:
        return grafica_confusion_controller()
    except Exception as e:
        return error_response(str(e), 500)

@dataset_bp.route("/grafica/roc")
def grafica_roc():
    try:
        return grafica_roc_controller()
    except Exception as e:
        return error_response(str(e), 500)

@dataset_bp.route("/predecir", methods=["POST"])
def predecir():
    try:
        data = request.json
        result = predecir_controller(data)
        return success_response(result)
    except Exception as e:
        return error_response(str(e), 500)
