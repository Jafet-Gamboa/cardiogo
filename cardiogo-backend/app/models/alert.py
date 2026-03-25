from flask import current_app
from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    try:
        sql = """
            SELECT 
                a.id alerta_id,
                ta.nombre alerta_tipo_alerta,
                na.nombre alerta_nivel_alerta,
                a.latitud alerta_latitud,
                a.longitud alerta_longitud,
                a.fecha_hora alerta_fecha_hora,
                p.id paciente_id,
                CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno ) paciente_nombre_completo
            FROM alertas a
            JOIN tipos_alerta ta ON a.tipo_id = ta.id
            JOIN niveles_alerta na ON a.nivel_id = na.id
            JOIN signos_vitales sv ON a.signos_vitales_id = sv.id
            JOIN dispositivos d ON sv.dispositivo_id = d.id
            JOIN pacientes p ON d.paciente_id = p.id
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN usuarios up ON p.usuario_id = up.id;
        """
        return execute_query(sql)
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_all de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_by_id(alert_id):
    try:
        sql = """
            SELECT 
                a.id alerta_id,
                ta.nombre alerta_tipo_alerta,
                na.nombre alerta_nivel_alerta,
                a.latitud alerta_latitud,
                a.longitud alerta_longitud,
                a.fecha_hora alerta_fecha_hora,
                p.id paciente_id,
                CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno ) paciente_paciente
            FROM alertas a
            JOIN tipos_alerta ta ON a.tipo_id = ta.id
            JOIN niveles_alerta na ON a.nivel_id = na.id
            JOIN signos_vitales sv ON a.signos_vitales_id = sv.id
            JOIN dispositivos d ON sv.dispositivo_id = d.id
            JOIN pacientes p ON d.paciente_id = p.id
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN usuarios up ON p.usuario_id = up.id
            WHERE a.id = %s
        """
        return execute_one(sql, (alert_id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_by_id de alertas: {e}")
        raise Exception("Error interno al obtener alerta")

def get_no_read_by_patient(id):
    try:
        sql = """
        select
        a.id as alerta_id,
        na.nombre as alerta_nivel,
        ta.nombre as alerta_tipo,
        sv.ritmo_cardiaco as valor_ritmo_cardiaco,
        sv.oxigenacion as valor_oxigenacion,
        sv.temperatura as valor_temperatura,
        a.longitud as ubicacion_longitud,
        a.latitud as ubicacion_latitud,
        a.fecha_hora as alerta_fecha_hora
        from alertas a
        inner join signos_vitales sv on sv.id = a.signos_vitales_id
        inner join dispositivos d on d.id = sv.dispositivo_id
        inner join pacientes p on p.id = d.paciente_id
        inner join usuarios up on up.id = p.usuario_id
        inner join tipos_alerta ta on ta.id = a.tipo_id
        inner join niveles_alerta na on na.id = a.nivel_id
        where up.id = %s and a.leido_paciente = 0
        order by a.fecha_hora desc;
        """
        return execute_query(sql, (id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_by_user de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_read_by_patient(id):
    try:
        sql = """
        select
        a.id as alerta_id,
        na.nombre as alerta_nivel,
        ta.nombre as alerta_tipo,
        sv.ritmo_cardiaco as valor_ritmo_cardiaco,
        sv.oxigenacion as valor_oxigenacion,
        sv.temperatura as valor_temperatura,
        a.longitud as ubicacion_longitud,
        a.latitud as ubicacion_latitud,
        a.fecha_hora as alerta_fecha_hora
        from alertas a
        inner join signos_vitales sv on sv.id = a.signos_vitales_id
        inner join dispositivos d on d.id = sv.dispositivo_id
        inner join pacientes p on p.id = d.paciente_id
        inner join usuarios up on up.id = p.usuario_id
        inner join tipos_alerta ta on ta.id = a.tipo_id
        inner join niveles_alerta na on na.id = a.nivel_id
        where up.id = %s and a.leido_paciente = 1
        order by a.fecha_hora desc;
        """
        return execute_query(sql, (id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_by_user de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_no_read_count_by_patient(id):
    try:
        sql = """
        select
        count(*) total
        from alertas a
        inner join signos_vitales sv on sv.id = a.signos_vitales_id
        inner join dispositivos d on d.id = sv.dispositivo_id
        inner join pacientes p on p.id = d.paciente_id
        inner join usuarios up on up.id = p.usuario_id
        inner join tipos_alerta ta on ta.id = a.tipo_id
        inner join niveles_alerta na on na.id = a.nivel_id
        where up.id = %s and a.leido_paciente = 0;
        """
        return execute_query(sql, (id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_count_by_user de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_no_read_by_caregiver(id):
    try:
        sql = """
        select
        a.id as alerta_id,
        na.nombre as alerta_nivel,
        ta.nombre as alerta_tipo,
        sv.ritmo_cardiaco as valor_ritmo_cardiaco,
        sv.oxigenacion as valor_oxigenacion,
        sv.temperatura as valor_temperatura,
        a.longitud as ubicacion_longitud,
        a.latitud as ubicacion_latitud,
        a.fecha_hora as alerta_fecha_hora
        from alertas a
        inner join signos_vitales sv on sv.id = a.signos_vitales_id
        inner join dispositivos d on d.id = sv.dispositivo_id
        inner join pacientes p on p.id = d.paciente_id
        inner join cuidador_paciente cp on p.id = cp.paciente_id
        inner join cuidadores cu on cu.id = cp.cuidador_id
        inner join usuarios up on up.id = cu.usuario_id
        inner join tipos_alerta ta on ta.id = a.tipo_id
        inner join niveles_alerta na on na.id = a.nivel_id
        where up.id = %s and a.leido_cuidador = 0
        order by a.fecha_hora desc;
        """
        return execute_query(sql, (id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_by_user de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_read_by_caregiver(id):
    try:
        sql = """
        select
        a.id as alerta_id,
        na.nombre as alerta_nivel,
        ta.nombre as alerta_tipo,
        sv.ritmo_cardiaco as valor_ritmo_cardiaco,
        sv.oxigenacion as valor_oxigenacion,
        sv.temperatura as valor_temperatura,
        a.longitud as ubicacion_longitud,
        a.latitud as ubicacion_latitud,
        a.fecha_hora as alerta_fecha_hora
        from alertas a
        inner join signos_vitales sv on sv.id = a.signos_vitales_id
        inner join dispositivos d on d.id = sv.dispositivo_id
        inner join pacientes p on p.id = d.paciente_id
        inner join cuidador_paciente cp on p.id = cp.paciente_id
        inner join cuidadores cu on cu.id = cp.cuidador_id
        inner join usuarios up on up.id = cu.usuario_id
        inner join tipos_alerta ta on ta.id = a.tipo_id
        inner join niveles_alerta na on na.id = a.nivel_id
        where up.id = %s and a.leido_cuidador = 1
        order by a.fecha_hora desc;
        """
        return execute_query(sql, (id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_by_user de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def get_no_read_count_by_caregiver(id):
    try:
        sql = """
        select
        count(*) total
        from alertas a
        inner join signos_vitales sv on sv.id = a.signos_vitales_id
        inner join dispositivos d on d.id = sv.dispositivo_id
        inner join pacientes p on p.id = d.paciente_id
        inner join cuidador_paciente cp on p.id = cp.paciente_id
        inner join cuidadores cu on cu.id = cp.cuidador_id
        inner join usuarios up on up.id = cu.usuario_id
        inner join tipos_alerta ta on ta.id = a.tipo_id
        inner join niveles_alerta na on na.id = a.nivel_id
        where up.id = %s and a.leido_cuidador = 0;
        """
        return execute_query(sql, (id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando get_count_by_user de alertas: {e}")
        raise Exception("Error interno al obtener alertas")

def create(data):
    try:
        sql = """
            INSERT INTO alertas (
                nivel_id,
                tipo_id,
                longitud,
                latitud,
                fecha_hora,
                signos_vitales_id,
                leido_paciente,
                leido_cuidador
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """
        return execute_insert(sql, (
            data.get("nivel_id"),
            data.get("tipo_id"),
            data["longitud"],
            data["latitud"],
            data["fecha_hora"],
            data.get("signos_vitales_id"),
            data["leido_paciente"],
            data["leido_cuidador"]
        ))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando create de alertas: {e}")
        raise Exception("Error interno al crear alerta")


def update_fijo(alerta_id, data):
    query = """
        UPDATE alertas
        SET nivel_id = %s, tipo_id = %s, longitud = %s, latitud = %s,
            fecha_hora = %s, signos_vitales_id = %s
        WHERE id = %s
    """
    params = (
        data["nivel_id"], data["tipo_id"], data["longitud"],
        data["latitud"], data["fecha_hora"], data["signos_vitales_id"], alerta_id
    )
    return execute_non_query(query, params)

def update_cuidador(alerta_id):
    query = """
        UPDATE alertas
        SET leido_cuidador = 1
        WHERE id = %s;
    """
    return execute_non_query(query, (alerta_id,))

def update_paciente(alerta_id):
    query = """
        UPDATE alertas
        SET leido_paciente = 1
        WHERE id = %s;
    """
    return execute_non_query(query, (alerta_id,))

def update_dinamico(alerta_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE alertas SET {', '.join(fields)} WHERE id = %s"
    values.append(alerta_id)
    return execute_non_query(query, tuple(values))

def delete(alert_id):
    try:
        sql = "DELETE FROM alertas WHERE id = %s;"
        return execute_non_query(sql, (alert_id,))
    except Exception as e:
        current_app.logger.error(f"Error ejecutando delete de alertas: {e}")
        raise Exception("Error interno al eliminar alerta")
