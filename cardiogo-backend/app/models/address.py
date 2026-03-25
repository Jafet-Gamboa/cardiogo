from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    return execute_query("""SELECT p.id paciente_id, p.usuario_id usuario_id, u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno,
        d.calle direccion_calle, d.numero_exterior direccion_numero_exterior, d.numero_interior direccion_numero_interior, d.colonia direccion_colonia, d.codigo_postal direccion_codigo_postal, d.estado direccion_estado
        FROM pacientes p
        JOIN direcciones d ON p.direccion_id = d.id
        JOIN usuarios u ON p.usuario_id = u.id;""")

def get_by_id(direccion_id):
    return execute_one(""" SELECT p.id paciente_id, p.usuario_id usuario_id, u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno,
        d.calle direccion_calle, d.numero_exterior direccion_numero_exterior, d.numero_interior direccion_numero_interior, d.colonia direccion_colonia, d.codigo_postal direccion_codigo_postal, d.estado direccion_estado
        FROM pacientes p
        JOIN direcciones d ON p.direccion_id = d.id
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE d.id =  %s;""", (direccion_id,))

def create(data):
    sql = """
        INSERT INTO direcciones (calle, numero_exterior, numero_interior, colonia, codigo_postal)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["calle"],
        data["numero_exterior"],
        data.get("numero_interior"),
        data["colonia"],
        data["codigo_postal"]
    ))

def update_fijo(direccion_id, data):
    query = """
        UPDATE direcciones
        SET calle = %s, numero_exterior = %s, numero_interior = %s,
            colonia = %s, codigo_postal = %s
        WHERE id = %s
    """
    params = (
        data["calle"], data["numero_exterior"], data.get("numero_interior"),
        data["colonia"], data["codigo_postal"], direccion_id
    )
    return execute_non_query(query, params)

def update_dinamico(direccion_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE direcciones SET {', '.join(fields)} WHERE id = %s"
    values.append(direccion_id)
    return execute_non_query(query, tuple(values))

def delete(direccion_id):
    return execute_non_query("DELETE FROM direcciones WHERE id = %s;", (direccion_id,))