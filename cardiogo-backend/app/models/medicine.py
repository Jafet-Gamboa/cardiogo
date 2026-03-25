from flask import current_app
from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    sql = """
        SELECT
            rm.id receta_id,
            rm.fecha_emision receta_fecha_emision,
            rm.estado receta_estado,
			u.id medico_id,
            concat( u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) medico_nombre_completo,
			up.id paciente_id,
            concat( up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            rm.indicaciones receta_indicaciones_generales,
            rmed.dosis medicamento_dosis,
            rmed.frecuencia medicamento_frecuencia,
            rmed.duracion medicamento_duracion,
            rmed.indicaciones_adicionales medicamento_indicaciones_adicionales,
            med.id medicamento_id,
            med.nombre medicamento_nombre,
            med.concentracion medicamento_concentracion,
            med.via_administracion medicamento_via_administracion,
            med.principio_activo medicamento_principio_activo,
            med.contenido_empaque medicamento_contenido_empaque
        FROM
            recetas_medicas rm
        JOIN
            medicos m ON rm.medico_id = m.id
        JOIN
            usuarios u ON m.usuario_id = u.id
        JOIN
            receta_medicamento rmed ON rm.id = rmed.receta_id
        JOIN
            medicamentos med ON rmed.medicamento_id = med.id
        JOIN
            pacientes p ON rm.paciente_id = p.id
        JOIN
            usuarios up ON p.usuario_id = up.id
    """
    return execute_query(sql)

def get_all_medicines():
    sql = """
        SELECT * FROM medicamentos
    """
    return execute_query(sql)

def get_by_id(receta_medicine_id):
    sql = """
        SELECT
            rm.id receta_id,
            rm.fecha_emision receta_fecha_emision,
            rm.estado receta_estado,
			u.id medico_id,
            concat( u.nombre, ' ', u.apellido_paterno, ' ', u.apellido_materno) medico_nombre_completo,
			up.id paciente_id,
            concat( up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) paciente_nombre_completo,
            rm.indicaciones receta_indicaciones_generales,
            rmed.dosis medicamento_dosis,
            rmed.frecuencia medicamento_frecuencia,
            rmed.duracion medicamento_duracion,
            rmed.indicaciones_adicionales medicamento_indicaciones_adicionales,
            med.id medicamento_id,
            med.nombre medicamento_nombre,
            med.concentracion medicamento_concentracion,
            med.via_administracion medicamento_via_administracion,
            med.principio_activo medicamento_principio_activo,
            med.contenido_empaque medicamento_contenido_empaque
        FROM
            recetas_medicas rm
        JOIN
            medicos m ON rm.medico_id = m.id
        JOIN
            usuarios u ON m.usuario_id = u.id
        JOIN
            receta_medicamento rmed ON rm.id = rmed.receta_id
        JOIN
            medicamentos med ON rmed.medicamento_id = med.id
        JOIN
            pacientes p ON rm.paciente_id = p.id
        JOIN
            usuarios up ON p.usuario_id = up.id
        WHERE rm.id = %s
    """
    return execute_one(sql, (receta_medicine_id,))

def get_by_id_medicine(receta_medicine_id):
    sql = """
        SELECT id FROM medicamentos WHERE id = %s
    """
    return execute_one(sql, (receta_medicine_id,))

def create(data):
    sql = """
        INSERT INTO medicamentos (
            nombre,
            concentracion,
            via_administracion,
            principio_activo,
            contenido_empaque,
            forma_farmaceutica
        )
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
    """
    return execute_insert(sql, (
        data["nombre"],
        data["concentracion"],
        data["via_administracion"],
        data["principio_activo"],
        data.get("contenido_empaque"),
        data["forma_farmaceutica"]
    ))

# def update(medicine_id, data):
#     sql = """
def update_fijo(medicamento_id, data):
    query = """
        UPDATE medicamentos
        SET nombre = %s, concentracion = %s, via_administracion = %s,
            principio_activo = %s, contenido_empaque = %s, forma_farmaceutica = %s
        WHERE id = %s
    """
    params = (
        data["nombre"], data["concentracion"], data["via_administracion"],
        data["principio_activo"], data["contenido_empaque"], data["forma_farmaceutica"],
        medicamento_id
    )
    return execute_non_query(query, params)

# def update_dinamico(medicamento_id, data):
#     fields, values = [], []
#     for key, value in data.items():
#         fields.append(f"{key} = %s")
#         values.append(value)
#     query = f"UPDATE medicamentos SET {', '.join(fields)} WHERE id = %s"
#     values.append(medicamento_id)
#     return execute_non_query(query, tuple(values))

def update_dinamico(medicamento_id, data):
    if not data:
        return None

    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)

    query = f"UPDATE medicamentos SET {', '.join(fields)} WHERE id = %s"
    values.append(medicamento_id)

    execute_non_query(query, tuple(values))

    # Después del update, obtener la fila actualizada
    sql_select = "SELECT * FROM medicamentos WHERE id = %s"
    updated_med = execute_query(sql_select, (medicamento_id,))

    return updated_med


def delete(medicine_id):
    return execute_non_query("DELETE FROM medicamentos WHERE id = %s", (medicine_id,))
