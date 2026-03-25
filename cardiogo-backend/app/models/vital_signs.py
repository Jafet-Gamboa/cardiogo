from app.main import execute_query, execute_one, execute_insert

def get_all():
    sql = """
        SELECT 
            sv.id signos__vitales_id,
            d.numero_serie dispositivo_numero_serie,
            p.id paciente_id,
            concat(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) paciente_nombre_completo,
            sv.fecha_hora signos__vitales_fecha_hora,

            sv.ritmo_cardiaco ritmo__cardiaco_valor,
            CASE
                WHEN sv.ritmo_cardiaco < rp.ritmo_min THEN 'Bajo'
                WHEN sv.ritmo_cardiaco > rp.ritmo_max THEN 'Alto'
                ELSE 'Normal'
            END AS ritmo__cardiaco_estado,
            sv.oxigenacion oxigenacion_valor,
            CASE
                WHEN sv.oxigenacion < rp.oxigenacion_min THEN 'Baja'
                WHEN sv.oxigenacion > rp.oxigenacion_max THEN 'Alta'
                ELSE 'Normal'
            END oxigenacion_estado,

            sv.temperatura temperatura_valor,
            CASE
                WHEN sv.temperatura < rp.temperatura_min THEN 'Baja'
                WHEN sv.temperatura > rp.temperatura_max THEN 'Alta'
                ELSE 'Normal'
            END temperatura_estado

        FROM signos_vitales sv
        JOIN dispositivos d ON sv.dispositivo_id = d.id
        JOIN pacientes p ON d.paciente_id = p.id
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN rangos_paciente rp ON rp.paciente_id = p.id
        ORDER BY sv.fecha_hora DESC;
    """
    return execute_query(sql)

def get_paciente_id_by_dispositivo(dispositivo_id):
    sql = """
        SELECT paciente_id
        FROM dispositivos
        WHERE id = %s
        LIMIT 1;
    """
    return execute_one(sql, (dispositivo_id,))

def get_all_last_patient_information():
    sql = """
        select distinct on (p.id)
        p.id as paciente_id,
        u.nombre || ' ' || u.apellido_paterno || ' ' || u.apellido_materno as paciente_nombre_completo,
        extract(year from age(p.fecha_nacimiento)) as paciente_edad,
        sv.ritmo_cardiaco as signos__vitales_ritmo_cardiaco,
        sv.oxigenacion as signos__vitales_oxigenacion,
        sv.temperatura as signos__vitales_temperatura
        from pacientes p
        join usuarios u on u.id = p.usuario_id
        join dispositivos d on d.paciente_id = p.id
        join signos_vitales sv on sv.dispositivo_id = d.id
        order by p.id, sv.fecha_hora desc;
    """
    return execute_query(sql)

def get_rangos_by_paciente(paciente_id):
    query = """
        SELECT ritmo_min, ritmo_max,
        oxigenacion_min, oxigenacion_max,
        temperatura_min, temperatura_max
        FROM rangos_paciente
        WHERE paciente_id = %s
        LIMIT 1
    """
    return execute_one(query, (paciente_id, ))

def get_temperature_range():
    sql = """
        SELECT temperatura_min, temperatura_max
        FROM rangos_paciente
        ORDER BY id DESC
        LIMIT 1;
    """
    return execute_one(sql)

def get_by_id(device_id):
    sql = """
        SELECT 
            sv.id signos__vitales_id,
            d.numero_serie dispositivo_numero_serie,
            p.id paciente_id,
            concat(u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) paciente_nombre_completo,
            sv.fecha_hora signos__vitales_fecha_hora,

            sv.ritmo_cardiaco ritmo__cardiaco_valor,
            CASE
                WHEN sv.ritmo_cardiaco < rp.ritmo_min THEN 'Bajo'
                WHEN sv.ritmo_cardiaco > rp.ritmo_max THEN 'Alto'
                ELSE 'Normal'
            END AS ritmo__cardiaco_estado,
            sv.oxigenacion oxigenacion_valor,
            CASE
                WHEN sv.oxigenacion < rp.oxigenacion_min THEN 'Baja'
                WHEN sv.oxigenacion > rp.oxigenacion_max THEN 'Alta'
                ELSE 'Normal'
            END oxigenacion_estado,

            sv.temperatura temperatura_valor,
            CASE
                WHEN sv.temperatura < rp.temperatura_min THEN 'Baja'
                WHEN sv.temperatura > rp.temperatura_max THEN 'Alta'
                ELSE 'Normal'
            END temperatura_estado

        FROM signos_vitales sv
        JOIN dispositivos d ON sv.dispositivo_id = d.id
        JOIN pacientes p ON d.paciente_id = p.id
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN rangos_paciente rp ON rp.paciente_id = p.id
        WHERE d.id = %s
        ORDER BY sv.fecha_hora DESC;
    """
    return execute_one(sql, (device_id,))

def create(data):
    sql = """
        INSERT INTO signos_vitales (
            ritmo_cardiaco,
            oxigenacion,
            temperatura,
            fecha_hora,
            dispositivo_id
        )
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["ritmo_cardiaco"],
        data["oxigenacion"],
        data["temperatura"],
        data["fecha_hora"],
        data.get("dispositivo_id")
    ))
