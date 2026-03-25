from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    sql = """
        SELECT *
        FROM rangos_paciente
    """
    return execute_query(sql)

def get_by_patient(id):
    sql = """
        select
        rp.id,
        rp.paciente_id,
        rp.ritmo_min,
        rp.ritmo_max,
        rp.ritmo_unidad,
        rp.oxigenacion_unidad,
        rp.oxigenacion_min,
        rp.oxigenacion_max,
        rp.temperatura_unidad,
        rp.temperatura_min,
        rp.temperatura_max
        from rangos_paciente rp
        inner join pacientes p on p.id = rp.paciente_id
        where p.id = %s;
    """
    return execute_one(sql, (id,))

def get_by_cuidador(id):
    sql = """
        select
        rp.id,
        rp.paciente_id,
        rp.ritmo_min,
        rp.ritmo_max,
        rp.ritmo_unidad,
        rp.oxigenacion_unidad,
        rp.oxigenacion_min,
        rp.oxigenacion_max,
        rp.temperatura_unidad,
        rp.temperatura_min,
        rp.temperatura_max
        from rangos_paciente rp
        inner join pacientes p on p.id = rp.paciente_id
        inner join cuidador_paciente cp on cp.paciente_id = p.id
        where cp.cuidador_id = %s;
    """
    return execute_one(sql, (id,))

def update_fijo(rango_id, data):
    query = """
        UPDATE rangos_paciente
        SET ritmo_min = %s,
            ritmo_max = %s,
            oxigenacion_min = %s,
            oxigenacion_max = %s,
            temperatura_min = %s,
            temperatura_max = %s,
            paciente_id = %s
        WHERE id = %s
    """
    params = (
        data["ritmo_min"],
        data["ritmo_max"],
        data["oxigenacion_min"],
        data["oxigenacion_max"],
        data["temperatura_min"],
        data["temperatura_max"],
        data["paciente_id"],
        rango_id
    )
    return execute_non_query(query, params)

def update_dinamico(rango_id, data):
    fields = []
    values = []

    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    query = f"""
        UPDATE rangos_paciente
        SET {', '.join(fields)}
        WHERE id = %s
    """
    values.append(rango_id)

    return execute_non_query(query, tuple(values))

def create(data):
    sql = """
        INSERT INTO rangos_paciente 
        (ritmo_min, ritmo_max,
        oxigenacion_min, oxigenacion_max,
        temperatura_min, temperatura_max,
        paciente_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["ritmo_min"],
        data["ritmo_max"],
        data["spo2_min"],
        data["spo2_max"],
        data["temperatura_min"],
        data["temperatura_max"],
        data["paciente_id"]
    ))
