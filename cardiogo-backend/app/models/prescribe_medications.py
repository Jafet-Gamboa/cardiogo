from app.main import execute_query, execute_one, execute_insert, execute_non_query

# Muestras las recetas de un médico específico
def get_all_by_doctor(doctor_id):
    sql = """
            SELECT
                r.id receta_id,
                r.fecha_emision receta_fecha_emision,
                r.medico_id medico_id,
                CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) medico_nombre_completo,
                m.cedula_profesional medico_cedula_profesional,
                r.paciente_id paciente_id,
                CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
                EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) paciente_edad,
                r.indicaciones receta_indicaciones_generales,
                STRING_AGG(
                    md.nombre || ' (' || rm.frecuencia || ', ' || rm.duracion || ', ' || rm.indicaciones_adicionales || ')',
                    E' - '
                ) medicamento_detalle_medicamentos,
                r.fecha_emision,
                        CASE
            WHEN (r.fecha_emision
                    + INTERVAL '1 day' * MAX(
                            COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
                        )
                    ) >= CURRENT_DATE
                THEN 'Activa'
                ELSE 'Vencida'
            END receta_estado
            FROM recetas_medicas r
            INNER JOIN receta_medicamento rm ON r.id = rm.receta_id
            INNER JOIN medicamentos md ON rm.medicamento_id = md.id
            INNER JOIN pacientes p ON r.paciente_id = p.id
            INNER JOIN usuarios up ON p.usuario_id = up.id
            INNER JOIN medicos m ON r.medico_id = m.id
            INNER JOIN usuarios um ON m.usuario_id = um.id

            WHERE m.id = %s

            GROUP BY
                r.id, r.fecha_emision, r.medico_id, um.nombre, um.apellido_paterno, um.apellido_materno,
                m.cedula_profesional, r.paciente_id, up.nombre, up.apellido_paterno, up.apellido_materno,
                p.fecha_nacimiento, r.indicaciones
            ORDER BY r.fecha_emision DESC;
        """
    return execute_query(sql, (doctor_id,))

# Muestras las recetas de un paciente específico
def get_by_patient_id(paciente_id):
    sql = """
        SELECT
            r.id receta_id,
            r.fecha_emision receta_fecha_emision,
            r.medico_id medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) medico_nombre_completo,
            m.cedula_profesional medico_cedula_profesional,
            r.paciente_id paciente_id,
            CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) paciente_edad,
            r.indicaciones receta_indicaciones_generales,
            STRING_AGG(
                md.nombre || ' (' || rm.frecuencia || ', ' || rm.duracion || ', ' || rm.indicaciones_adicionales || ')',
                E' - '
            ) medicamento_detalle_medicamentos,

            (
                r.fecha_emision
                + INTERVAL '1 day' * MAX(
                    COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
                )
            ) AS receta_fecha_vencimiento,

            CASE
                WHEN (
                    r.fecha_emision
                    + INTERVAL '1 day' * MAX(
                        COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
                    )
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

        GROUP BY
            r.id, r.fecha_emision, r.medico_id, um.nombre, um.apellido_paterno, um.apellido_materno,
            m.cedula_profesional, r.paciente_id, up.nombre, up.apellido_paterno, up.apellido_materno,
            p.fecha_nacimiento, r.indicaciones

        ORDER BY r.fecha_emision DESC;

    """
    return execute_query(sql, (paciente_id,))

# TODAS LAS RECETAS 
def get_all_new():
    sql = r"""
        SELECT
            r.id receta_id,
            r.fecha_emision receta_fecha_emision,
            r.medico_id medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) medico_nombre_completo,
            m.cedula_profesional medico_cedula_profesional,
            r.paciente_id paciente_id,
            CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) paciente_edad,
            r.indicaciones receta_indicaciones_generales,
            STRING_AGG(
                md.nombre || ' (' || rm.frecuencia || ', ' || rm.duracion || ', ' || rm.indicaciones_adicionales || ')',
                E'\n- '
            ) medicamento_detalle_medicamentos,
            
            r.fecha_emision
                + INTERVAL '1 day' * MAX(
                    COALESCE(
                        NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int,
                        0
                    )
                ) receta_fecha_terminacion,

            CASE
                WHEN (r.fecha_emision
                    + INTERVAL '1 day' * MAX(
                            COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
                        )
                    ) >= CURRENT_DATE
                THEN 'Activa'
                ELSE 'Vencida'
            END receta_estado

        FROM recetas_medicas r
        INNER JOIN receta_medicamento rm ON r.id = rm.receta_id
        INNER JOIN medicamentos md ON rm.medicamento_id = md.id
        INNER JOIN pacientes p ON r.paciente_id = p.id
        INNER JOIN usuarios up ON p.usuario_id = up.id
        INNER JOIN medicos m ON r.medico_id = m.id
        INNER JOIN usuarios um ON m.usuario_id = um.id
        GROUP BY
            r.id, r.fecha_emision, r.medico_id, um.nombre, um.apellido_paterno, um.apellido_materno,
            m.cedula_profesional, r.paciente_id, up.nombre, up.apellido_paterno, up.apellido_materno,
            p.fecha_nacimiento, r.indicaciones
        ORDER BY r.fecha_emision DESC;

    """
    return execute_query(sql)

def get_receta_by_cuidador(cuidador_id):
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

        STRING_AGG(
            md.nombre || ' (' || rm.frecuencia || ', ' || rm.duracion || ', ' || rm.indicaciones_adicionales || ')',
            E' - '
        ) AS medicamento_detalle_medicamentos,

        (
            r.fecha_emision
            + INTERVAL '1 day' * MAX(
                COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
            )
        ) AS receta_fecha_vencimiento,

        CASE
            WHEN (
                r.fecha_emision
                + INTERVAL '1 day' * MAX(
                    COALESCE(NULLIF(regexp_replace(rm.duracion, '\D', '', 'g'), '')::int, 0)
                )
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
    INNER JOIN cuidadores c ON c.id = cp.cuidador_id

    WHERE c.id = 1

    GROUP BY
        r.id, r.fecha_emision, r.medico_id, um.nombre, um.apellido_paterno, um.apellido_materno,
        m.cedula_profesional, r.paciente_id, up.nombre, up.apellido_paterno, up.apellido_materno,
        p.fecha_nacimiento, r.indicaciones

    ORDER BY r.fecha_emision DESC;
    """
    return execute_query(sql, (cuidador_id,))

#Idea en proceso
def search_any_field(query):
    words = query.split()
    sql = """
        SELECT md.medico_id medico_id, concat(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) medico_nombre_completo, 
            m.cedula_profesional medico_cedula_profesional,
            md.dispositivo_id dispositivo_id, d.numero_serie dispositivo_numero_serie, d.paciente_id paciente_id,
            concat(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo, 
            p.fecha_nacimiento paciente_fecha_nacimiento, EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) paciente_edad,
            up.email paciente_email, up.telefono paciente_telefono
        FROM medico_dispositivo md
        INNER JOIN medicos m ON md.medico_id = m.id
        INNER JOIN usuarios um ON m.usuario_id = um.id
        INNER JOIN dispositivos d ON md.dispositivo_id = d.id
        INNER JOIN pacientes p ON d.paciente_id = p.id
        INNER JOIN usuarios up ON p.usuario_id = up.id
        WHERE 
    """
    conditions = []
    params = []
    for word in words:
        conditions.append("unaccent(concat(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno)) ILIKE unaccent(%s)")
        params.append(f"%{word}%")
    sql += " AND ".join(conditions)
    return execute_query(sql, tuple(params))

def create(data):
    """
    data: dict con las llaves:
        fecha_emision, indicaciones, paciente_id, medico_id, medicamentos
        donde medicamentos es una lista de dicts con:
        medicamento_id, dosis, frecuencia, duracion, indicaciones_adicionales
    """
    # Insertar la receta principal
    sql_receta = """
        INSERT INTO recetas_medicas (fecha_emision, indicaciones, paciente_id, medico_id)
        VALUES (%s, %s, %s, %s)
        RETURNING id;
    """
    receta_id = execute_insert(sql_receta, (
        data["fecha_emision"],
        data["indicaciones"],
        data["paciente_id"],
        data["medico_id"]
    ))

    # Insertar cada medicamento relacionado
    sql_medicamento = """
        INSERT INTO receta_medicamento (receta_id, medicamento_id, dosis, frecuencia, duracion, indicaciones_adicionales)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    for med in data["medicamentos"]:
        execute_non_query(sql_medicamento, (
            receta_id,
            med["medicamento_id"],
            med.get("dosis"),
            med.get("frecuencia"),
            med.get("duracion"),
            med.get("indicaciones_adicionales")
        ))

    return receta_id

