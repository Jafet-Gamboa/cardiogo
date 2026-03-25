from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("""
        select
			c.id cuidador_id,
            uc.id cuidador_usuario_id,
            uc.nombre cuidador_nombre,
            uc.apellido_paterno cuidador_apellido_paterno,
            uc.apellido_materno cuidador_apellido_materno,
            uc.email cuidador_email,
            uc.telefono cuidador_telefono,
            uc.estado cuidador_estado,
            p.id paciente_id,
            CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno ) paciente_nombre_completo,
            up.estado paciente_estado,
            p.fecha_nacimiento paciente_fecha_nacimiento,
            cp.fecha_asignacion cuidador__paciente_fecha_asignacion,cp.cuidador_id cuidador__paciente_cuidador_id, cp.paciente_id cuidador__paciente_paciente_id,
            m.id medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno ) medico_nombre_completo,
            um.estado medico_estado
        FROM cuidador_paciente cp
        JOIN cuidadores c ON cp.cuidador_id = c.id
        JOIN pacientes p ON cp.paciente_id = p.id
        JOIN medicos m ON p.medico_id = m.id
		JOIN usuarios um ON p.medico_id = um.id
        JOIN usuarios uc ON c.usuario_id = uc.id
        JOIN usuarios up ON p.usuario_id = up.id;
    """)


def get_by_usuario_id(usuario_id):
    return execute_one("""
        SELECT id AS cuidador_id
        FROM cuidadores
        WHERE usuario_id = %s;
    """, (usuario_id,))

def get_by_id(cuidador_id):
    return execute_one("""
        select
			c.id cuidador_id,
            uc.id cuidador_usuario_id,
            uc.nombre cuidador_nombre,
            uc.apellido_paterno cuidador_apellido_paterno,
            uc.apellido_materno cuidador_apellido_materno,
            uc.email cuidador_email,
            uc.telefono cuidador_telefono,
            uc.estado cuidador_estado,
            p.id paciente_id,
            CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno ) paciente_nombre_completo,
            up.estado paciente_estado,
            p.fecha_nacimiento paciente_fecha_nacimiento,
            cp.fecha_asignacion cuidador__paciente_fecha_asignacion,
            m.id medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno ) medico_nombre_completo,
            um.estado medico_estado
        FROM cuidador_paciente cp
        JOIN cuidadores c ON cp.cuidador_id = c.id
        JOIN pacientes p ON cp.paciente_id = p.id
        JOIN medicos m ON p.medico_id = m.id
		JOIN usuarios um ON p.medico_id = um.id
        JOIN usuarios uc ON c.usuario_id = uc.id
        JOIN usuarios up ON p.usuario_id = up.id
        WHERE uc.id = %s;""", (cuidador_id,))

def get_caregiver_by_id(cuidador_id):
    return execute_one("""
        select
			c.id cuidador_id,
            uc.id cuidador_usuario_id,
            uc.nombre cuidador_nombre,
            uc.apellido_paterno cuidador_apellido_paterno,
            uc.apellido_materno cuidador_apellido_materno,
            uc.email cuidador_email,
            uc.telefono cuidador_telefono,
            uc.estado cuidador_estado,
            p.id paciente_id,
            CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno ) paciente_nombre_completo,
            up.estado paciente_estado,
            p.fecha_nacimiento paciente_fecha_nacimiento,
            cp.fecha_asignacion cuidador__paciente_fecha_asignacion,
            m.id medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno ) medico_nombre_completo,
            um.estado medico_estado
        FROM cuidador_paciente cp
        JOIN cuidadores c ON cp.cuidador_id = c.id
        JOIN pacientes p ON cp.paciente_id = p.id
        JOIN medicos m ON p.medico_id = m.id
		JOIN usuarios um ON p.medico_id = um.id
        JOIN usuarios uc ON c.usuario_id = uc.id
        JOIN usuarios up ON p.usuario_id = up.id
        WHERE c.id = %s;""", (cuidador_id,))

def create(data):
    return execute_insert("INSERT INTO cuidadores (relacion_paciente, usuario_id) VALUES (%s,%s) RETURNING id;", (data["relacion_paciente"],data["usuario_id"]))

def update_fijo(cuidador_id, data):
    query = """
        UPDATE cuidadores
        SET relacion_paciente = %s, estado = %s, usuario_id = %s
        WHERE id = %s
    """
    params = (data["relacion_paciente"], data["estado"], data["usuario_id"], cuidador_id)
    return execute_non_query(query, params)

def update_dinamico(cuidador_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE cuidadores SET {', '.join(fields)} WHERE id = %s"
    values.append(cuidador_id)
    return execute_non_query(query, tuple(values))

def delete(cuidador_id):
    return execute_non_query("DELETE FROM cuidadores WHERE id = %s;", (cuidador_id,))

def count():
    return execute_one("SELECT COUNT(*) total_cuidadores FROM cuidadores;")