from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("SELECT id, nombre FROM tipos_alerta")

def get_by_id(tipo_id):
    return execute_one("SELECT id, nombre FROM tipos_alerta WHERE id = %s;", (tipo_id,))

def get_types_count_by_patient(patient_id):
    return execute_query("""
        SELECT ta.nombre tipo_alerta, COUNT(a.id) total_alertas
        FROM alertas a
        INNER JOIN tipos_alerta ta ON a.tipo_id = ta.id
        INNER JOIN signos_vitales sv ON a.signos_vitales_id = sv.id
        INNER JOIN dispositivos d ON sv.dispositivo_id = d.id
        WHERE d.paciente_id = %s
        GROUP BY ta.nombre
        ORDER BY total_alertas DESC;
    """, (patient_id,))

def create(data):
    return execute_insert(
        "INSERT INTO tipos_alerta (nombre) VALUES (%s) RETURNING id;", 
        (data["nombre"],)
    )


def update_fijo(tipo_id, data):
    query = "UPDATE tipos_alerta SET nombre = %s WHERE id = %s"
    params = (data["nombre"], tipo_id)
    return execute_non_query(query, params)

def update_dinamico(tipo_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE tipos_alerta SET {', '.join(fields)} WHERE id = %s"
    values.append(tipo_id)
    return execute_non_query(query, tuple(values))

def delete(tipo_id):
    return execute_non_query("DELETE FROM tipos_alerta WHERE id = %s;", (tipo_id,))