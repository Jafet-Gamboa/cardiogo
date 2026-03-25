from flask import current_app
from app.models import vital_signs as vital_signs_model
from app.controllers.alert import create as create_alert_controller
from app.utils.notifications import send_fcm_to_topic
from decimal import Decimal

ubicaciones = {
    
}

def vital_signs_list():
    try:
        return vital_signs_model.get_all()
    except Exception as e:
        current_app.logger.error(f"Error listando los signos vitales: {e}")
        raise Exception("Error interno al obtener los signos vitales")

def vital_signs_list_information():
    try:
        return vital_signs_model.get_all_last_patient_information()
    except Exception as e:
        current_app.logger.error(f"Error listando los signos vitales: {e}")
        raise Exception("Error interno al obtener los signos vitales")

def get_vital_signs(vital_signs_id):
    try:
        return vital_signs_model.get_by_id(vital_signs_id)
    except Exception as e:
        current_app.logger.error(f"Error obteniendo el signo vital: {e}")
        raise Exception("Error interno al obtener el signo vital")

def to_float(x):
    if isinstance(x, Decimal):
        return float(x)
    return float(x) if x is not None else None


def calcular_nivel(valor, minimo, maximo):
    # Asegurar que todo sea float
    valor = to_float(valor)
    minimo = to_float(minimo)
    maximo = to_float(maximo)

    # Dentro del rango
    if minimo <= valor <= maximo:
        return 0, 0.0

    # Diferencia relativa
    if valor < minimo:
        diferencia = (minimo - valor) / minimo
    else:
        diferencia = (valor - maximo) / maximo

    # Clasificación
    if diferencia < 0.10:
        return 1, diferencia      # Advertencia
    elif diferencia < 0.25:
        return 2, diferencia      # Moderada
    else:
        return 3, diferencia      # Crítica

def create(data):
    try:
        required = ["ritmo_cardiaco", "oxigenacion", "temperatura"]
        for f in required:
            if f not in data:
                raise ValueError(f"El campo '{f}' es obligatorio")

        # Registrar signos vitales
        new_id = vital_signs_model.create(data)

        # Obtener paciente por dispositivo
        device_id = data.get("dispositivo_id")
        paciente = vital_signs_model.get_paciente_id_by_dispositivo(device_id)

        if not paciente:
            raise Exception("No se encontró el paciente del dispositivo")

        paciente_id = paciente["paciente_id"]

        rangos = vital_signs_model.get_rangos_by_paciente(paciente_id)
        if not rangos:
            return {"id": new_id}

        # Valores entrantes
        temperatura = data["temperatura"]
        ritmo = data["ritmo_cardiaco"]
        oxigenacion = data["oxigenacion"]

        paciente_topic = f"paciente_{paciente_id}_alertas"

        # -------------------------------------- TEMPERATURA
        nivel_temp, dif_temp = calcular_nivel(
            temperatura, rangos["temperatura_min"], rangos["temperatura_max"]
        )

        if nivel_temp > 0:  # Hay alerta
            tipo_id = 5 if temperatura < rangos["temperatura_min"] else 6

            alerta_data = {
                "nivel_id": nivel_temp,
                "tipo_id": tipo_id,
                "latitud": 32.460152,
                "longitud": -116.825490,
                "fecha_hora": data["fecha_hora"],
                "signos_vitales_id": new_id,
                "leido_paciente": 0,
                "leido_cuidador":0,
            }
            create_alert_controller(alerta_data)

            # Enviar FCM solo si es moderada o critica
            if nivel_temp in [2, 3]:
                titulo = "Temperatura Baja" if tipo_id == 5 else "Temperatura Alta"
                msg = f"Temperatura fuera del rango: {temperatura}°C"

                send_fcm_to_topic(
                    paciente_topic,
                    titulo,
                    msg,
                    data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
                )

        # -------------------------------------- RITMO CARDIACO
        nivel_ritmo, dif_ritmo = calcular_nivel(
            ritmo, rangos["ritmo_min"], rangos["ritmo_max"]
        )

        if nivel_ritmo > 0:
            tipo_id = 2 if ritmo < rangos["ritmo_min"] else 1

            alerta_data = {
                "nivel_id": nivel_ritmo,
                "tipo_id": tipo_id,
                "latitud": 32.460152,
                "longitud": -116.825490,
                "fecha_hora": data["fecha_hora"],
                "signos_vitales_id": new_id,
                "leido_paciente": 0,
                "leido_cuidador":0,
            }
            create_alert_controller(alerta_data)

            if nivel_ritmo in [2, 3]:
                titulo = "Ritmo Cardíaco Bajo" if tipo_id == 2 else "Ritmo Cardíaco Alto"
                msg = f"Ritmo fuera del rango: {ritmo}"

                send_fcm_to_topic(
                    paciente_topic,
                    titulo,
                    msg,
                    data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
                )

        # -------------------------------------- OXIGENACION
        nivel_ox, dif_ox = calcular_nivel(
            oxigenacion, rangos["oxigenacion_min"], rangos["oxigenacion_max"]
        )

        if nivel_ox > 0:
            tipo_id = 3 if oxigenacion < rangos["oxigenacion_min"] else 4

            alerta_data = {
                "nivel_id": nivel_ox,
                "tipo_id": tipo_id,
                "latitud": 32.460152,
                "longitud": -116.825490,
                "fecha_hora": data["fecha_hora"],
                "signos_vitales_id": new_id,
                "leido_paciente": 0,
                "leido_cuidador":0,
            }
            create_alert_controller(alerta_data)

            if nivel_ox in [2, 3]:
                titulo = "Oxigenación Baja" if tipo_id == 3 else "Oxigenación Alta"
                msg = f"Oxigenación fuera del rango: {oxigenacion}%"

                send_fcm_to_topic(
                    paciente_topic,
                    titulo,
                    msg,
                    data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
                )

        return {"id": new_id}

    except Exception as e:
        current_app.logger.error(f"Error creando signos vitales: {e}")
        raise Exception("Error interno al crear signos vitales")

# def create(data):
#     try:
#         required = ["ritmo_cardiaco", "oxigenacion", "temperatura"]
#         for f in required:
#             if f not in data:
#                 raise ValueError(f"El campo '{f}' es obligatorio")

#         new_id = vital_signs_model.create(data)

#         device_id = data.get("dispositivo_id")
#         paciente = vital_signs_model.get_paciente_id_by_dispositivo(device_id)

#         if not paciente:
#             raise Exception("No se encontró el paciente del dispositivo")

#         paciente_id = paciente["paciente_id"]

#         rangos = vital_signs_model.get_rangos_by_paciente(paciente_id)

#         if not rangos:
#             return {"id": new_id}

#         temperatura = data.get("temperatura")
#         ritmo = data.get("ritmo_cardiaco")
#         oxigenacion = data.get("oxigenacion")

#         paciente_topic = f"paciente_{paciente_id}_alertas"

#         # ---------------- TEMPERATURA ----------------
#         if temperatura is not None:
#             temp_min = rangos["temperatura_min"]
#             temp_max = rangos["temperatura_max"]

#             if temperatura < temp_min:
#                 alerta_data = {
#                     "nivel_id": 2,
#                     "tipo_id": 5,  # Temperatura Baja
#                     "latitud": 0,
#                     "longitud": 0,
#                     "fecha_hora": data["fecha_hora"],
#                     "signos_vitales_id": new_id,
#                 }
#                 create_alert_controller(alerta_data)

#                 send_fcm_to_topic(
#                     paciente_topic,
#                     "Temperatura Baja",
#                     f"Temperatura por debajo del rango: {temperatura}°C",
#                     data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
#                 )

#             elif temperatura > temp_max:
#                 alerta_data = {
#                     "nivel_id": 2,
#                     "tipo_id": 6,  # Temperatura Alta
#                     "latitud": 0,
#                     "longitud": 0,
#                     "fecha_hora": data["fecha_hora"],
#                     "signos_vitales_id": new_id,
#                 }
#                 create_alert_controller(alerta_data)

#                 send_fcm_to_topic(
#                     paciente_topic,
#                     "Temperatura Alta",
#                     f"Temperatura por encima del rango: {temperatura}°C",
#                     data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
#                 )

#         # ---------------- RITMO CARDIACO ----------------
#         if ritmo is not None:
#             ritmo_min = rangos["ritmo_min"]
#             ritmo_max = rangos["ritmo_max"]

#             if ritmo < ritmo_min:
#                 alerta_data = {
#                     "nivel_id": 2,
#                     "tipo_id": 2,  # Ritmo Cardiaco Bajo
#                     "latitud": 0,
#                     "longitud": 0,
#                     "fecha_hora": data["fecha_hora"],
#                     "signos_vitales_id": new_id,
#                 }
#                 create_alert_controller(alerta_data)

#                 send_fcm_to_topic(
#                     paciente_topic,
#                     "Ritmo Cardíaco Bajo",
#                     f"Ritmo por debajo del rango: {ritmo}",
#                     data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
#                 )

#             elif ritmo > ritmo_max:
#                 alerta_data = {
#                     "nivel_id": 2,
#                     "tipo_id": 1,  # Ritmo Cardiaco Alto
#                     "latitud": 0,
#                     "longitud": 0,
#                     "fecha_hora": data["fecha_hora"],
#                     "signos_vitales_id": new_id,
#                 }
#                 create_alert_controller(alerta_data)

#                 send_fcm_to_topic(
#                     paciente_topic,
#                     "Ritmo Cardíaco Alto",
#                     f"Ritmo por encima del rango: {ritmo}",
#                     data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
#                 )

#         # ---------------- OXIGENACIÓN ----------------
#         if oxigenacion is not None:
#             ox_min = rangos["oxigenacion_min"]
#             ox_max = rangos["oxigenacion_max"]

#             if oxigenacion < ox_min:
#                 alerta_data = {
#                     "nivel_id": 2,
#                     "tipo_id": 3,  # Oxigenación Baja
#                     "latitud": 0,
#                     "longitud": 0,
#                     "fecha_hora": data["fecha_hora"],
#                     "signos_vitales_id": new_id,
#                 }
#                 create_alert_controller(alerta_data)

#                 send_fcm_to_topic(
#                     paciente_topic,
#                     "Oxigenación Baja",
#                     f"Oxigenación por debajo del rango: {oxigenacion}%",
#                     data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
#                 )

#             elif oxigenacion > ox_max:
#                 alerta_data = {
#                     "nivel_id": 2,
#                     "tipo_id": 4,  # Oxigenación Alta
#                     "latitud": 0,
#                     "longitud": 0,
#                     "fecha_hora": data["fecha_hora"],
#                     "signos_vitales_id": new_id,
#                 }
#                 create_alert_controller(alerta_data)

#                 send_fcm_to_topic(
#                     paciente_topic,
#                     "Oxigenación Alta",
#                     f"Oxigenación por encima del rango: {oxigenacion}%",
#                     data={"signos_vitales_id": str(new_id), "paciente_id": str(paciente_id)}
#                 )

#         return {"id": new_id}

#     except Exception as e:
#         current_app.logger.error(f"Error creando signos vitales: {e}")
#         raise Exception("Error interno al crear signos vitales")
