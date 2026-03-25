from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("SELECT id, descripcion FROM roles ORDER BY id;")

def get_by_id(role_id):
    return execute_one("SELECT id, descripcion FROM roles WHERE id = %s;", (role_id,))

def create(data):
    return execute_insert("INSERT INTO roles (descripcion) VALUES (%s) RETURNING id;", (data["descripcion"],))

def update_fijo(role_id, data):
    query = "UPDATE roles SET descripcion = %s WHERE id = %s"
    params = (data["descripcion"], role_id)
    return execute_non_query(query, params)

def update_dinamico(role_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE roles SET {', '.join(fields)} WHERE id = %s"
    values.append(role_id)
    return execute_non_query(query, tuple(values))

def delete(role_id):
    return execute_non_query("DELETE FROM roles WHERE id = %s;", (role_id,))