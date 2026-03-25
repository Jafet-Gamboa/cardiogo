from flask import current_app
from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    current_app.logger.debug("Listando todas las recetas médicas")
    sql = """
        SELECT r.id receta_id, r.fecha_emision receta_fecha_emision, r.indicaciones receta_indicaciones, r.estado receta_estado,
        p.id paciente_id, p.fecha_nacimiento paciente_fecha_nacimiento, p.estado_civil paciente_estado_civil, p.ocupacion paciente_ocupacion, p.sexo paciente_sexo,
        u.nombre paciente_nombre, u.apellido_paterno paciente_apellido_paterno, u.apellido_materno paciente_apellido_materno, u.email paciente_email,
        m.id medico_id, mu.nombre medico_nombre, mu.apellido_paterno medico_apellido_paterno, mu.apellido_materno medico_apellido_materno, mu.email medico_email
        FROM recetas_medicas r
        INNER JOIN pacientes p ON r.paciente_id = p.id
        INNER JOIN usuarios u ON p.usuario_id = u.id
        INNER JOIN medicos m ON r.medico_id = m.id
        INNER JOIN usuarios mu ON m.usuario_id = mu.id
        ORDER BY r.fecha_emision DESC;
    """
    return execute_query(sql)

def get_by_id(receta_id):
    sql = """
        SELECT r.id receta_id, r.fecha_emision receta_fecha_emision, r.indicaciones receta_indicaciones, r.estado receta_estado,
        p.id paciente_id, p.fecha_nacimiento paciente_fecha_nacimiento, p.estado_civil paciente_estado_civil, p.ocupacion paciente_ocupacion, p.sexo paciente_sexo,
        u.nombre paciente_nombre, u.apellido_paterno paciente_apellido_paterno, u.apellido_materno paciente_apellido_materno, u.email paciente_email,
        m.id medico_id, mu.nombre medico_nombre, mu.apellido_paterno medico_apellido_paterno, mu.apellido_materno medico_apellido_materno, mu.email medico_email
        FROM recetas_medicas r
        INNER JOIN pacientes p ON r.paciente_id = p.id
        INNER JOIN usuarios u ON p.usuario_id = u.id
        INNER JOIN medicos m ON r.medico_id = m.id
        INNER JOIN usuarios mu ON m.usuario_id = mu.id
        WHERE r.id = %s
    """
    return execute_one(sql, (receta_id,))

def get_prescriptions_by_patient(paciente_id):
    sql = """
    SELECT
        r.id AS receta_id,
        r.fecha_emision AS receta_fecha_emision,
        r.medico_id AS medico_id,
        CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) AS medico_nombre_completo,
        m.cedula_profesional AS medico_cedula_profesional,

        r.paciente_id AS paciente_id,
        CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) AS paciente_nombre_completo,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) AS paciente_edad,

        r.indicaciones AS receta_indicaciones_generales,

        md.nombre AS medicamento_nombre,
        rm.frecuencia AS medicamento_frecuencia,
        rm.duracion AS medicamento_duracion,
        rm.dosis AS medicamento_dosis,
        rm.indicaciones_adicionales AS medicamento_indicaciones_adicionales,
        

        (r.fecha_emision
        + INTERVAL '1 day' *
            COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
        ) AS receta_fecha_vencimiento,

        CASE
            WHEN (
                r.fecha_emision
                + INTERVAL '1 day' *
                COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
            ) >= CURRENT_DATE
            THEN 'Activa'
            ELSE 'Vencida'
        END AS receta_estado

    FROM recetas_medicas r
    INNER JOIN receta_medicamento rm ON r.id = rm.receta_id
    INNER JOIN medicamentos md ON rm.medicamento_id = md.id
    INNER JOIN pacientes p ON r.paciente_id = p.id
    INNER JOIN usuarios up ON p.usuario_id = up.id
    INNER JOIN medicos m ON r.medico_id = m.id
    INNER JOIN usuarios um ON m.usuario_id = um.id

    WHERE p.id = %s

    ORDER BY r.fecha_emision DESC;

    """
    return execute_query(sql, (paciente_id,))

def get_prescriptions_by_cuidador(id):
    sql = """
    SELECT
        r.id AS receta_id,
        r.fecha_emision AS receta_fecha_emision,
        r.medico_id AS medico_id,
        CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) AS medico_nombre_completo,
        m.cedula_profesional AS medico_cedula_profesional,

        r.paciente_id AS paciente_id,
        CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) AS paciente_nombre_completo,
        EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) AS paciente_edad,

        r.indicaciones AS receta_indicaciones_generales,

        md.nombre AS medicamento_nombre,
        rm.frecuencia AS medicamento_frecuencia,
        rm.duracion AS medicamento_duracion,
        rm.dosis AS medicamento_dosis,
        rm.indicaciones_adicionales AS medicamento_indicaciones_adicionales,

        (
            r.fecha_emision
            + INTERVAL '1 day' *
                COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
        ) AS receta_fecha_vencimiento,

        CASE
            WHEN (
                r.fecha_emision
                + INTERVAL '1 day' *
                COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
            ) >= CURRENT_DATE
            THEN 'Activa'
            ELSE 'Vencida'
        END AS receta_estado

    FROM recetas_medicas r
    INNER JOIN receta_medicamento rm ON r.id = rm.receta_id
    INNER JOIN medicamentos md ON rm.medicamento_id = md.id
    INNER JOIN pacientes p ON r.paciente_id = p.id
    INNER JOIN usuarios up ON p.usuario_id = up.id
    INNER JOIN medicos m ON r.medico_id = m.id
    INNER JOIN usuarios um ON m.usuario_id = um.id
    INNER JOIN cuidador_paciente cp ON cp.paciente_id = p.id

    WHERE cp.cuidador_id = %s

    ORDER BY r.fecha_emision DESC;
    """
    return execute_query(sql, (id,))

def create(data):
    sql = """
        INSERT INTO recetas_medicas (fecha_emision, indicaciones, paciente_id, medico_id)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["fecha_emision"],
        data["indicaciones"],
        data["paciente_id"],
        data["medico_id"]
    ))

def update_fijo(receta_id, data):
    query = """
        UPDATE recetas_medicas
        SET fecha_emision = %s, indicaciones = %s,
            paciente_id = %s, medico_id = %s
        WHERE id = %s
    """
    params = (
        data["fecha_emision"], data["indicaciones"],
        data["paciente_id"], data["medico_id"], receta_id
    )
    execute_non_query(query, params)

def update_dinamico(receta_id, data):
    fields = ", ".join([f"{key} = %s" for key in data.keys()])
    query = f"UPDATE recetas_medicas SET {fields} WHERE id = %s"
    params = tuple(data.values()) + (receta_id,)
    execute_non_query(query, params)

def delete(receta_id):
    sql = "DELETE FROM recetas_medicas WHERE id = %s"
    return execute_non_query(sql, (receta_id,))