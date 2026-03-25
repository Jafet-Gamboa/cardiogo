from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    query = """
        SELECT 
            d.id dispositivo_id,
            d.numero_serie dispositivo_numero_serie, 
            d.modelo dispositivo_modelo,
            d.estado dispositivo_estado,
            d.paciente_id paciente_id,
            CONCAT(up.apellido_paterno, ' ', up.apellido_materno, ' ', up.nombre) paciente_nombre_completo,
            up.estado paciente_estado,
            d.cuidador_id cuidador_id,
            CONCAT(uc.apellido_paterno, ' ', uc.apellido_materno, ' ', uc.nombre) cuidador_nombre_completo,
            uc.estado cuidador_estado,
            m.id medico_id,
            m.cedula_profesional medico_cedula_profesional,
            CONCAT(um.apellido_paterno, ' ', um.apellido_materno, ' ', um.nombre) medico_nombre_completo,
            um.estado medico_estado
        FROM dispositivos d
        INNER JOIN pacientes p ON p.id = d.paciente_id
        INNER JOIN usuarios up ON up.id = p.usuario_id
        INNER JOIN cuidadores c ON c.id = d.cuidador_id
        INNER JOIN usuarios uc ON uc.id = c.usuario_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        INNER JOIN medicos m ON m.id = md.medico_id
        INNER JOIN usuarios um ON um.id = m.usuario_id
    """
    return execute_query(query)

def get_all_devices():
    query = """
        SELECT 
            d.id dispositivo_id,
            d.numero_serie dispositivo_numero_serie, 
            d.modelo dispositivo_modelo,
            d.estado dispositivo_estado,
            d.paciente_id paciente_id,
            d.cuidador_id cuidador_id
        FROM dispositivos d
    """
    return execute_query(query)

def get_by_id(dispositivo_id):
    query = """
        SELECT 
            d.id dispositivo_id,
            d.numero_serie dispositivo_numero_serie, 
            d.modelo dispositivo_modelo,
            d.estado dispositivo_estado,
            d.paciente_id paciente_id,
            CONCAT(up.apellido_paterno, ' ', up.apellido_materno, ' ', up.nombre) paciente_nombre_completo,
            up.estado paciente_estado,
            d.cuidador_id cuidador_id,
            CONCAT(uc.apellido_paterno, ' ', uc.apellido_materno, ' ', uc.nombre) cuidador_nombre_completo,
            uc.estado cuidador_estado,
            m.id medico_id,
            m.cedula_profesional medico_cedula_profesional,
            CONCAT(um.apellido_paterno, ' ', um.apellido_materno, ' ', um.nombre) medico_nombre_completo,
            um.estado medico_estado
        FROM dispositivos d
        INNER JOIN pacientes p ON p.id = d.paciente_id
        INNER JOIN usuarios up ON up.id = p.usuario_id
        INNER JOIN cuidadores c ON c.id = d.cuidador_id
        INNER JOIN usuarios uc ON uc.id = c.usuario_id
        INNER JOIN medico_dispositivo md ON md.dispositivo_id = d.id
        INNER JOIN medicos m ON m.id = md.medico_id
        INNER JOIN usuarios um ON um.id = m.usuario_id
        WHERE d.id = %s;
    """
    return execute_one(query, (dispositivo_id,))


def get_by_cuidador_id(cuidador_id):
    query = """
        SELECT 
            sv.id signos__vitales_id,
            sv.ritmo_cardiaco ritmo__cardiaco_valor,
            sv.oxigenacion oxigenacion_valor,
            sv.temperatura temperatura_valor,

            CASE
                WHEN sv.ritmo_cardiaco < (SELECT ritmo_min FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Bajo'
                WHEN sv.ritmo_cardiaco > (SELECT ritmo_max FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Alto'
                ELSE 'Normal'
            END AS ritmo__cardiaco_estado,

            CASE
                WHEN sv.oxigenacion < (SELECT oxigenacion_min FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Baja'
                WHEN sv.oxigenacion > (SELECT oxigenacion_max FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Alta'
                ELSE 'Normal'
            END AS oxigenacion_estado,

            CASE
                WHEN sv.temperatura < (SELECT temperatura_min FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Baja'
                WHEN sv.temperatura > (SELECT temperatura_max FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Alta'
                ELSE 'Normal'
            END AS temperatura_estado,

            sv.fecha_hora signos__vitales_fecha_hora,
            d.numero_serie dispositivo_numero_serie,
            d.marca dispositivo_marca,
            d.modelo dispositivo_modelo,
            d.estado dispositivo_estado,
            p.id paciente_id,
            CONCAT(u_p.nombre, ' ', u_p.apellido_paterno, ' ', u_p.apellido_materno) paciente_nombre_completo,
            u_p.estado paciente_estado

        FROM signos_vitales sv
        JOIN dispositivos d ON sv.dispositivo_id = d.id
        JOIN pacientes p ON d.paciente_id = p.id
        JOIN usuarios u_p ON u_p.id = p.usuario_id
        JOIN cuidadores c ON c.id = d.cuidador_id
        JOIN usuarios u_c ON u_c.id = c.usuario_id

        WHERE u_c.id = %s
        ORDER BY sv.fecha_hora DESC
        LIMIT 1;
    """
    return execute_one(query, (cuidador_id,))


def get_by_patient_id(patient_id):
    query = """
        SELECT 
            sv.id signos_vitales_id,
            sv.ritmo_cardiaco ritmo__cardiaco_valor,
            sv.oxigenacion oxigenacion_valor,
            sv.temperatura temperatura_valor,

            CASE
                WHEN sv.ritmo_cardiaco < (SELECT ritmo_min FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Bajo'
                WHEN sv.ritmo_cardiaco > (SELECT ritmo_max FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Alto'
                ELSE 'Normal'
            END AS ritmo__cardiaco_estado,

            CASE
                WHEN sv.oxigenacion < (SELECT oxigenacion_min FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Baja'
                WHEN sv.oxigenacion > (SELECT oxigenacion_max FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Alta'
                ELSE 'Normal'
            END AS oxigenacion_estado,

            CASE
                WHEN sv.temperatura < (SELECT temperatura_min FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Baja'
                WHEN sv.temperatura > (SELECT temperatura_max FROM rangos_paciente rp WHERE rp.paciente_id = p.id ORDER BY id DESC LIMIT 1) THEN 'Alta'
                ELSE 'Normal'
            END AS temperatura_estado,

            sv.fecha_hora signos__vitales_fecha_hora,
            d.numero_serie dispositivo_numero_serie,
            d.marca dispositivo_marca,
            d.modelo dispositivo_modelo,
            d.estado dispositivo_estado,
            p.id paciente_id,
            p.usuario_id paciente_usuario_id,
            CONCAT(u_p.nombre, ' ', u_p.apellido_paterno, ' ', u_p.apellido_materno) paciente_nombre_completo,
            u_p.estado paciente_estado

        FROM signos_vitales sv
        JOIN dispositivos d ON sv.dispositivo_id = d.id
        JOIN pacientes p ON d.paciente_id = p.id
        JOIN usuarios u_p ON u_p.id = p.usuario_id
        JOIN cuidadores c ON c.id = d.cuidador_id
        JOIN usuarios u_c ON u_c.id = c.usuario_id

        WHERE p.id = %s
        ORDER BY sv.fecha_hora DESC;
    """
    return execute_one(query, (patient_id,))


def create(data):
    sql = """
        INSERT INTO dispositivos (numero_serie, modelo, marca, estado, paciente_id, cuidador_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["numero_serie"],
        data["modelo"],
        data["marca"],
        data["estado"],
        data["paciente_id"],
        data["cuidador_id"]
    ))


def update_fijo(dispositivo_id, data):
    query = """
        UPDATE dispositivos
        SET numero_serie = %s,
            modelo = %s,
            marca = %s,
            estado = %s,
            paciente_id = %s,
            cuidador_id = %s
        WHERE id = %s
    """
    params = (
        data["numero_serie"], data["modelo"], data["marca"], data["estado"],
        data["paciente_id"], data["cuidador_id"], dispositivo_id
    )
    return execute_non_query(query, params)


def update_dinamico(dispositivo_id, data):
    fields, values = [], []

    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    query = f"UPDATE dispositivos SET {', '.join(fields)} WHERE id = %s"
    values.append(dispositivo_id)

    return execute_non_query(query, tuple(values))


def delete(dispositivo_id):
    return execute_non_query("DELETE FROM dispositivos WHERE id = %s;", (dispositivo_id,))
