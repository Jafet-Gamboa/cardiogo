from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("""
    SELECT m.id medico_id, m.cedula_profesional medico_cedula_especialidad, m.especialidad medico_especialidad, m.usuario_id medico_usuario_id,
    CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) medico_nombre_completo,
    u.telefono medico_telefono, u.email medico_correo, m.estado medico_estado
    FROM medicos m
    INNER JOIN usuarios u ON m.usuario_id = u.id
""")

def get_patients_by_medico(id):
    return execute_query("""
    SELECT 
    p.id,
    CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) AS nombre,
    DATE_PART('year', AGE(p.fecha_nacimiento)) AS edad,
    p.sexo AS genero
    FROM pacientes p
    INNER JOIN usuarios u ON p.usuario_id = u.id
    WHERE p.medico_id = %s;
""", (id, ))

def get_by_usuario_id(usuario_id):
    return execute_one("""
        SELECT id AS medico_id
        FROM medicos
        WHERE usuario_id = %s;
    """, (usuario_id,))

def get_by_id(medico_id):
    return execute_one("""
        SELECT m.id medico_id, m.cedula_profesional medico_cedula_especialidad, m.especialidad medico_especialidad, m.usuario_id medico_usuario_id,
        CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) medico_nombre_completo,
        u.telefono medico_telefono, u.email medico_correo, m.estado medico_estado
        FROM medicos m
        INNER JOIN usuarios u ON m.usuario_id = u.id
        WHERE m.usuario_id = %s;""", (medico_id,))

def create(data):
    sql = """
        INSERT INTO medicos (cedula_profesional, especialidad, usuario_id)
        VALUES (%s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["cedula_profesional"],
        data["especialidad"],
        data["usuario_id"]
    ))


def update_fijo(medico_id, data):
    query = """
        UPDATE medicos
        SET cedula_profesional = %s, especialidad = %s, usuario_id = %s
        WHERE id = %s
    """
    params = (data["cedula_profesional"], data["especialidad"], data["usuario_id"], medico_id)
    return execute_non_query(query, params)

def update_dinamico(medico_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE medicos SET {', '.join(fields)} WHERE id = %s"
    values.append(medico_id)
    return execute_non_query(query, tuple(values))

def delete(medico_id):
    return execute_non_query("DELETE FROM medicos WHERE id = %s;", (medico_id,))

# ============================================================
# 🔥 CONSULTAS DEL DASHBOARD GENERAL DEL MÉDICO (m_id)
# ============================================================

def pacientes_en_riesgo(m_id):
    return execute_one("""
        SELECT COUNT(DISTINCT p.id) AS pacientes_en_riesgo
        FROM alertas a
        INNER JOIN signos_vitales sv ON sv.id = a.signos_vitales_id
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        INNER JOIN pacientes p ON p.id = d.paciente_id
        WHERE md.medico_id = %s
          AND a.fecha_hora >= NOW() - INTERVAL '24 HOURS';
    """, (m_id,))


def alertas_hoy(m_id):
    return execute_one("""
        SELECT COUNT(*) AS alertas_hoy
        FROM alertas a
        INNER JOIN signos_vitales sv ON sv.id = a.signos_vitales_id
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND DATE(a.fecha_hora) = CURRENT_DATE;
    """, (m_id,))


def dispositivos_activos(m_id):
    return execute_one("""
        SELECT COUNT(d.id) AS dispositivos_activos
        FROM dispositivos d
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND d.estado = 'Activo';
    """, (m_id,))


def pacientes_criticos(m_id):
    return execute_query("""
        SELECT 
            p.id paciente_id,
            CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) AS paciente_nombre_completo,
            COUNT(a.id) AS paciente_score
        FROM pacientes p
        INNER JOIN usuarios u ON u.id = p.usuario_id
        INNER JOIN dispositivos d ON d.paciente_id = p.id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        LEFT JOIN signos_vitales sv ON sv.dispositivo_id = d.id
        LEFT JOIN alertas a 
               ON a.signos_vitales_id = sv.id 
              AND DATE(a.fecha_hora) = CURRENT_DATE
        WHERE md.medico_id = %s
        GROUP BY p.id, paciente_nombre_completo
        ORDER BY paciente_score DESC;
    """, (m_id,))


def actividad_sistema(m_id):
    return execute_query("""
        SELECT 
            DATE(sv.fecha_hora) AS dia,
            COUNT(*) AS lecturas
        FROM signos_vitales sv
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
        GROUP BY DATE(sv.fecha_hora)
        ORDER BY dia ASC;
    """, (m_id,))


def distribucion_edad(m_id):
    return execute_query("""
        SELECT 
            CASE
                WHEN EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) BETWEEN 18 AND 30 THEN '18-30'
                WHEN EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) BETWEEN 31 AND 45 THEN '31-45'
                WHEN EXTRACT(YEAR FROM AGE(p.fecha_nacimiento)) BETWEEN 46 AND 60 THEN '46-60'
                ELSE '60+'
            END AS rango,
            COUNT(*) AS cantidad
        FROM pacientes p
        INNER JOIN dispositivos d ON d.paciente_id = p.id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
        GROUP BY rango
        ORDER BY rango;
    """, (m_id,))


def tipos_alerta_frecuentes(m_id):
    return execute_query("""
        SELECT 
            ta.nombre AS tipo_alerta,
            COUNT(a.id) AS cantidad
        FROM alertas a
        INNER JOIN tipos_alerta ta ON ta.id = a.tipo_id
        INNER JOIN signos_vitales sv ON sv.id = a.signos_vitales_id
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND a.fecha_hora >= NOW() - INTERVAL '30 DAYS'
        GROUP BY ta.nombre
        ORDER BY cantidad DESC;
    """, (m_id,))



# ============================================================
# 🔥 CONSULTAS INDIVIDUALES POR PACIENTE (m_id, paciente_id)
# ============================================================

def evolucion_ritmo(m_id, paciente_id):
    return execute_query("""
        SELECT 
        DATE(sv.fecha_hora) AS fecha,
        sv.ritmo_cardiaco AS valor
        FROM signos_vitales sv
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
        AND d.paciente_id = %s
        AND sv.fecha_hora >= NOW() - INTERVAL '7 DAYS'
        ORDER BY fecha ASC;
    """, (m_id, paciente_id))


def evolucion_oxigenacion(m_id, paciente_id):
    return execute_query("""
        SELECT 
        DATE(sv.fecha_hora) AS fecha,
        sv.oxigenacion AS valor
        FROM signos_vitales sv
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND d.paciente_id = %s
          AND sv.fecha_hora >= NOW() - INTERVAL '7 DAYS'
        ORDER BY fecha ASC;
    """, (m_id, paciente_id))


def evolucion_temperatura(m_id, paciente_id):
    return execute_query("""
        SELECT 
            DATE(sv.fecha_hora) AS fecha,
            sv.temperatura AS valor
        FROM signos_vitales sv
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND d.paciente_id = %s
          AND sv.fecha_hora >= NOW() - INTERVAL '7 DAYS'
        ORDER BY fecha ASC;
    """, (m_id, paciente_id))


def alertas_por_dia(m_id, paciente_id):
    return execute_query("""
        SELECT 
            DATE(a.fecha_hora) AS fecha,
            COUNT(*) AS cantidad
        FROM alertas a
        INNER JOIN signos_vitales sv ON sv.id = a.signos_vitales_id
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND d.paciente_id = %s
          AND a.fecha_hora >= NOW() - INTERVAL '7 DAYS'
        GROUP BY DATE(a.fecha_hora)
        ORDER BY fecha ASC;
    """, (m_id, paciente_id))

def ritmo_por_hora(m_id, paciente_id):
    return execute_query("""
        SELECT 
            date_trunc('hour', sv.fecha_hora) AS hora,
            sv.ritmo_cardiaco AS ritmo
        FROM signos_vitales sv
        INNER JOIN dispositivos d ON d.id = sv.dispositivo_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        WHERE md.medico_id = %s
          AND d.paciente_id = %s
          AND sv.fecha_hora >= NOW() - INTERVAL '24 HOURS'
        ORDER BY hora ASC;
    """, (m_id, paciente_id))