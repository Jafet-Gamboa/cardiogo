from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
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
    """
    return execute_query(sql)

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
