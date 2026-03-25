from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("SELECT id, nombre FROM niveles_alerta")

def get_by_id(nivel_id):
    return execute_one("SELECT id, nombre FROM niveles_alerta WHERE id = %s;", (nivel_id,))

def get_levels_count_by_patient(patient_id):
    return execute_query("""
        SELECT na.nombre nivel_alerta, COUNT(a.id) total_alertas
        FROM alertas a
        INNER JOIN niveles_alerta na ON a.nivel_id = na.id
        INNER JOIN signos_vitales sv ON a.signos_vitales_id = sv.id
        INNER JOIN dispositivos d ON sv.dispositivo_id = d.id
        WHERE d.paciente_id = %s
        GROUP BY na.nombre
        ORDER BY total_alertas DESC;
    """, (patient_id,))

def create(data):
    return execute_insert("INSERT INTO niveles_alerta (nombre) VALUES (%s) RETURNING id;", (data["nombre"],))

def update_fijo(nivel_id, data):
    query = "UPDATE niveles_alerta SET nombre = %s WHERE id = %s"
    params = (data["nombre"], nivel_id)
    return execute_non_query(query, params)

def update_dinamico(nivel_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE niveles_alerta SET {', '.join(fields)} WHERE id = %s"
    values.append(nivel_id)
    return execute_non_query(query, tuple(values))

def delete(nivel_id):
    return execute_non_query("DELETE FROM niveles_alerta WHERE id = %s;", (nivel_id,))