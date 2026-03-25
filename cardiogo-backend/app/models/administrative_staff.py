from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("""SELECT pa.id personal__administrativo_id, pa.telefono_interno personal__administrativo_telefono_interno, estado personal__administrativo_estado,
        u.id usuario_id, 
        u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno,
        u.email usuario_email, u.telefono usuario_telefono, u.estado usuario_estado
        FROM personal_administrativo pa
        JOIN usuarios u ON pa.usuario_id = u.id""")

def get_by_id(personal_id):
    return execute_one("""SELECT pa.id personal__administrativo_id, pa.telefono_interno personal__administrativo_telefono_interno,
        u.id usuario_id, 
        u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno,
        u.email usuario_email, u.telefono usuario_telefono, u.estado usuario_estado
        FROM personal_administrativo pa
        JOIN usuarios u ON pa.usuario_id = u.id 
        WHERE pa.id = %s;""", (personal_id,))

def get_by_usuario_id(usuario_id):
    return execute_one("""
        SELECT id AS personal_adm_id
        FROM personal_administrativo
        WHERE usuario_id = %s;
    """, (usuario_id,))

def create(data):
    sql = """
        INSERT INTO personal_administrativo (usuario_id, telefono_interno)
        VALUES (%s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["usuario_id"],
        data("telefono_interno")
    ))

def update_fijo(personal_id, data):
    query = """
        UPDATE personal_administrativo
        SET telefono_interno = %s, usuario_id = %s
        WHERE id = %s
    """
    params = (data["telefono_interno"], data["usuario_id"], personal_id)
    return execute_non_query(query, params)

def update_dinamico(personal_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE personal_administrativo SET {', '.join(fields)} WHERE id = %s"
    values.append(personal_id)
    return execute_non_query(query, tuple(values))

def delete(personal_id):
    return execute_non_query("DELETE FROM personal_administrativo WHERE id = %s;", (personal_id,))

def count():
    sql = "SELECT COUNT(*) AS total FROM personal_administrativo;"
    result = execute_one(sql)
    return result["total"] if result and "total" in result else 0