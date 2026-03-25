from flask import current_app
from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    sql = """
        SELECT cp.id cuidador__paciente_id, 
            up.id paciente_id, 
            concat(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            up.estado paciente_estado,
            uc.id cuidador_id,
            concat(uc.nombre, ' ', uc.apellido_paterno, ' ', uc.apellido_materno) cuidador_nombre_completo,
            uc.estado cuidador_estado,
			c.relacion_paciente cuidador_relacion_paciente,
            cp.fecha_asignacion cuidador__cuidador_paciente_fecha_asignacion,
            cp.estado cuidador__cuidador_paciente_estado
        FROM cuidador_paciente cp
        INNER JOIN pacientes p ON cp.paciente_id = p.id
		INNER JOIN usuarios up ON p.usuario_id = up.id
		INNER JOIN cuidadores c ON cp.cuidador_id = c.id
		INNER JOIN usuarios uc ON c.usuario_id = uc.id
    """
    return execute_query(sql)

def get_all_information_caregiver_patient(usuario_paciente_id):
    sql = """
        select
        p.id as paciente_paciente_id,
        p.fecha_nacimiento as paciente_fecha_nacimiento,
        p.estado_civil as paciente_estado_civil,
        p.ocupacion as paciente_ocupacion,
        p.sexo as paciente_sexo,
        p.estado as paciente_estado,
        up.id as paciente_usuario_id,
        up.nombre as paciente_nombre,
        up.apellido_paterno as paciente_apellido_paterno,
        up.apellido_materno as paciente_apellido_materno,
        up.email as paciente_email,
        up.telefono as paciente_telefono,
        up.estado as paciente_estado,
        c.id as cuidador_cuidador_id,
        c.relacion_paciente as cuidador_relacion_paciente,
        c.estado as cuidador_estado,
        uc.id as cuidador_usuario_id,
        uc.nombre as cuidador_nombre,
        uc.apellido_paterno as cuidador_apellido_paterno,
        uc.apellido_materno as cuidador_apellido_materno,
        uc.email as cuidador_email,
        uc.telefono as cuidador_telefono,
        cp.fecha_asignacion as cuidador__cuidador_paciente_fecha_asignacion
        from pacientes p
        join usuarios up on p.usuario_id = up.id
        join cuidador_paciente cp on cp.paciente_id = p.id
        join cuidadores c on cp.cuidador_id = c.id
        join usuarios uc on c.usuario_id = uc.id
        where up.id = %s;
    """
    return execute_query(sql, usuario_paciente_id)

def get_caregiver_patient_by_id(paciente_id):
    sql = """
    SELECT cp.id cuidador__paciente_id, 
            up.id paciente_id,
            concat(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            uc.id cuidador_id,
            concat(uc.nombre, ' ', uc.apellido_paterno, ' ', uc.apellido_materno) cuidador_nombre_completo,
            cp.fecha_asignacion cuidador__paciente_fecha_asignacion
        FROM cuidador_paciente cp
        INNER JOIN pacientes p ON cp.paciente_id = p.id
        INNER JOIN usuarios up ON p.usuario_id = up.id
        INNER JOIN cuidadores c ON cp.cuidador_id = c.id
        INNER JOIN usuarios uc ON c.usuario_id = uc.id
        where p.id = %s;
    """
    return execute_query(sql, paciente_id)

def search_any_field(query):
    words = query.split()
    sql = """
        SELECT cp.id cuidador__paciente_id, 
            up.id paciente_id,
            concat(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            uc.id cuidador_id,
            concat(uc.nombre, ' ', uc.apellido_paterno, ' ', uc.apellido_materno) cuidador_nombre_completo,
            cp.fecha_asignacion cuidador__paciente_fecha_asignacion
        FROM cuidador_paciente cp
        INNER JOIN pacientes p ON cp.paciente_id = p.id
        INNER JOIN usuarios up ON p.usuario_id = up.id
        INNER JOIN cuidadores c ON cp.cuidador_id = c.id
        INNER JOIN usuarios uc ON c.usuario_id = uc.id
        WHERE 
    """
    conditions = []
    params = []
    for word in words:
        conditions.append("unaccent(concat(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno)) ILIKE unaccent(%s)")
        params.append(f"%{word}%")
    sql += " AND ".join(conditions)
    return execute_query(sql, tuple(params))

def create(data):
    return execute_insert("INSERT INTO cuidador_paciente (cuidador_id, paciente_id, fecha_asignacion, estado) VALUES (%s,%s,%s,%s) RETURNING id;", 
                          (data['cuidador_id'], data['paciente_id'], data['fecha_asignacion'], data['estado']))
