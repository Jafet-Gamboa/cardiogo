from flask import current_app
from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    """Obtener todos los pacientes"""
    current_app.logger.debug("Ejecutando get_all pacientes")
    sql = """
        SELECT 
            p.id AS paciente_id,
            p.usuario_id,
            p.fecha_nacimiento AS paciente_fecha_nacimiento,
            p.estado_civil AS paciente_estado_civil,
            p.ocupacion AS paciente_ocupacion,
            p.sexo AS paciente_sexo,
            p.estado AS paciente_estado,
            p.medico_id AS paciente_medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) AS medico_nombre_completo,
            p.direccion_id AS paciente_direccion_id,
            CONCAT(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) AS usuario_nombre_completo,
            u.email AS usuario_email,
            u.telefono AS usuario_telefono

        FROM pacientes p
        INNER JOIN usuarios u 
            ON p.usuario_id = u.id
        LEFT JOIN medicos m
            ON p.medico_id = m.id
        LEFT JOIN usuarios um
        ON m.usuario_id = um.id;

    """
    return execute_query(sql)

def get_by_usuario_id(usuario_id):
    return execute_one("""
        SELECT id AS paciente_id
        FROM pacientes
        WHERE usuario_id = %s;
    """, (usuario_id,))

def get_by_id(patient_id):
    """Obtener paciente por ID"""
    current_app.logger.debug(f"Buscando paciente con ID {patient_id}")
    sql = """
        SELECT p.id paciente_id, p.usuario_id, p.fecha_nacimiento paciente_fecha_nacimiento, p.estado_civil paciente_estado_civil,
        p.ocupacion paciente_ocupacion, p.sexo paciente_sexo, p.estado paciente_estado, p.direccion_id paciente_direccion_id,
        u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno, u.email usuario_email, u.telefono usuario_telefono
        FROM pacientes p
        INNER JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.id = %s
    """
    return execute_one(sql, (patient_id,))

def get_patientCompleteById(patient_id):
    """Obtener paciente por ID"""
    current_app.logger.debug(f"Buscando paciente completo con ID {patient_id}")
    sql = """
        SELECT 
            CASE WHEN p.estado_civil IS NOT NULL THEN 1 ELSE 0 END AS estadoCivil,
            CASE WHEN p.ocupacion IS NOT NULL THEN 1 ELSE 0 END AS ocupacion,
            CASE WHEN p.personal_adm_id IS NOT NULL THEN 1 ELSE 0 END AS personalAdmId,
            CASE WHEN p.direccion_id IS NOT NULL THEN 1 ELSE 0 END AS direccionId
        FROM pacientes p
        WHERE p.id = %s
    """
    return execute_one(sql, (patient_id,))


def create(data):
    """Crear paciente"""
    sql = """
        INSERT INTO pacientes (usuario_id, fecha_nacimiento, estado_civil, ocupacion, sexo, personal_adm_id, direccion_id, estado, medico_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s,%s)
        RETURNING id
    """
    current_app.logger.debug(f"Creando paciente para usuario {data['usuario_id']}")
    return execute_insert(sql, (
        data["usuario_id"],
        data["fecha_nacimiento"],
        data.get("estado_civil"),
        data.get("ocupacion"),
        data.get("sexo"),
        data.get("personal_adm_id"),
        data.get("direccion_id"),
        data.get("estado"),
        data.get("medico_id")
    ))

def update_fijo(paciente_id, data):
    query = """
        UPDATE pacientes
        SET fecha_nacimiento = %s, estado_civil = %s, ocupacion = %s,
            sexo = %s, estado = %s, usuario_id = %s, personal_adm_id = %s
        WHERE id = %s
    """
    params = (
        data["fecha_nacimiento"], data["estado_civil"], data["ocupacion"],
        data["sexo"], data["estado"], data["usuario_id"], data["personal_adm_id"],
        paciente_id
    )
    return execute_non_query(query, params)

def update_dinamico(paciente_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE pacientes SET {', '.join(fields)} WHERE id = %s"
    print(query)
    values.append(paciente_id)
    return execute_non_query(query, tuple(values))

def delete(patient_id):
    """Eliminar paciente"""
    current_app.logger.debug(f"Eliminando paciente ID {patient_id}")
    sql = "DELETE FROM pacientes WHERE id = %s"
    return execute_non_query(sql, (patient_id,))
