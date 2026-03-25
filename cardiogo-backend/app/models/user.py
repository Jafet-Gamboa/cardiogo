from flask import current_app
from app.main import execute_query, execute_one, execute_insert, execute_non_query

def get_all():
    current_app.logger.debug("ejecutando get_all usuarios")
    return execute_query("""SELECT u.id usuario_id, u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno, u.telefono usuario_telefono, 
                            u.email usuario_email, u.estado usuario_estado, u.rol_id rol_id,
                            r.descripcion rol_descripcion
                            FROM usuarios u
                            INNER JOIN roles r ON u.rol_id = r.id""")

def cards():
    current_app.logger.debug("ejecutando cards usuarios")
    return execute_query("""SELECT
    (SELECT COUNT(*)
        FROM pacientes
        INNER JOIN usuarios ON usuarios.id = pacientes.usuario_id
    ) AS pacientes,
    (SELECT COUNT(*)
        FROM recetas_medicas
        INNER JOIN pacientes ON pacientes.id = recetas_medicas.paciente_id
        INNER JOIN medicos ON medicos.id = recetas_medicas.medico_id
    ) AS recetas,
    (SELECT COUNT(*)
        FROM medicamentos
        INNER JOIN receta_medicamento ON receta_medicamento.medicamento_id = medicamentos.id
    ) AS medicamentos,
    (SELECT COUNT(*)
        FROM alertas
        INNER JOIN niveles_alerta ON niveles_alerta.id = alertas.nivel_id
        INNER JOIN tipos_alerta ON tipos_alerta.id = alertas.tipo_id
        INNER JOIN signos_vitales ON signos_vitales.id = alertas.signos_vitales_id
        INNER JOIN dispositivos ON dispositivos.id = signos_vitales.dispositivo_id
        INNER JOIN pacientes ON pacientes.id = dispositivos.paciente_id
        WHERE niveles_alerta.nombre = 'Crítico'
    ) AS alertas_criticas;
""")

def get_by_id(user_id):
    current_app.logger.debug("ejecutando get_all usuarios")
    return execute_query("""SELECT u.id usuario_id, u.nombre usuario_nombre, u.apellido_paterno usuario_apellido_paterno, u.apellido_materno usuario_apellido_materno, u.telefono usuario_telefono, u.email usuario_email, u.estado usuario_estado, u.rol_id rol_id, r.descripcion rol_descripcion 
                            FROM usuarios u
                            INNER JOIN roles r ON u.rol_id = r.id
                            WHERE u.id = %s""", (user_id,))

def get_basic_user(user_id):
    return execute_one("""
        SELECT 
            u.id AS usuario_id,
            u.nombre,
            u.apellido_paterno,
            u.apellido_materno,
            u.telefono,
            u.email,
            u.estado,
            u.rol_id,
            r.descripcion AS rol_descripcion
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        WHERE u.id = %s
    """, (user_id,))

def get_doctor_data(user_id):
    return execute_one("""
        SELECT 
            m.id AS medico_id,
            m.usuario_id,
            u.nombre,
            u.apellido_paterno,
            u.apellido_materno,
            u.telefono,
            u.email,
            u.estado
        FROM medicos m
        JOIN usuarios u ON m.usuario_id = u.id
        WHERE m.usuario_id = %s
    """, (user_id,))

def get_patient_data(user_id):
    return execute_one("""
        SELECT
            p.id AS paciente_id,
            u.nombre,
            u.apellido_paterno,
            u.apellido_materno,
            u.telefono,
            u.email,
            u.estado,
            p.fecha_nacimiento,
            m.id AS medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) AS medico_nombre_completo,
            c.id AS cuidador_id,
            CONCAT(uc.nombre, ' ', uc.apellido_paterno, ' ', uc.apellido_materno) AS cuidador_nombre_completo,
            uc.telefono AS cuidador_telefono     
        FROM cuidador_paciente cp
		JOIN pacientes p ON cp.paciente_id = p.id
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN medicos m ON p.medico_id = m.id
        JOIN usuarios um ON m.usuario_id = um.id
        JOIN cuidadores c ON cp.cuidador_id = c.id
        JOIN usuarios uc ON c.usuario_id = uc.id
        WHERE p.usuario_id = %s
    """, (user_id,))

def get_caregiver_data(user_id):
    return execute_one("""
        SELECT
            c.id AS cuidador_id,
            
            -- Datos del cuidador
            uc.id AS cuidador_usuario_id,
            uc.nombre AS cuidador_nombre,
            uc.apellido_paterno AS cuidador_apellido_paterno,
            uc.apellido_materno AS cuidador_apellido_materno,
            uc.email AS cuidador_email,
            uc.telefono AS cuidador_telefono,
            uc.estado AS cuidador_estado,

            -- Paciente asignado
            p.id AS paciente_id,
            CONCAT(up.nombre, ' ', up.apellido_paterno, ' ', up.apellido_materno) AS paciente_nombre_completo,
            up.estado AS paciente_estado,
            p.fecha_nacimiento AS paciente_fecha_nacimiento,

            -- Relación cuidador-paciente
            cp.fecha_asignacion AS cuidador_paciente_fecha_asignacion,

            -- Médico del paciente
            m.id AS medico_id,
            CONCAT(um.nombre, ' ', um.apellido_paterno, ' ', um.apellido_materno) AS medico_nombre_completo,
            um.estado AS medico_estado

        FROM cuidadores c
        JOIN usuarios uc ON c.usuario_id = uc.id

        JOIN cuidador_paciente cp ON cp.cuidador_id = c.id
        JOIN pacientes p ON cp.paciente_id = p.id
        JOIN usuarios up ON p.usuario_id = up.id

        JOIN medicos m ON p.medico_id = m.id
        JOIN usuarios um ON m.usuario_id = um.id

        WHERE c.usuario_id = %s
    """, (user_id,))



def create(data):
    sql = """
        insert into usuarios (nombre, apellido_paterno, apellido_materno, telefono, email, password, rol_id)
        values (%s, %s, %s, %s, %s, %s, %s)
        returning id
    """
    current_app.logger.debug(f"creando usuario con email {data['email']}")
    return execute_insert(sql, (
        data["nombre"],
        data["apellido_paterno"],
        data["apellido_materno"],
        data["telefono"],
        data["email"],
        data["password"],
        data["rol_id"]
    ))

def get_by_email(email):
    current_app.logger.debug(f"buscando usuario por email: {email}")
    return execute_one("""
        SELECT u.id, u.nombre, u.apellido_paterno, u.apellido_materno, u.telefono, u.email, u.password, u.rol_id, r.descripcion 
        FROM usuarios u
        INNER JOIN roles r ON u.rol_id = r.id
        WHERE email = %s
    """, (email,))

def update_password(user_id, new_password):
    sql = "update usuarios set password = %s where id = %s"
    current_app.logger.debug(f"actualizando contraseña para usuario {user_id}")
    return execute_non_query(sql, (new_password, user_id))

def update_user(user_id, data):
    if not data:
        return None

    fields = []
    values = []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    values.append(user_id)

    sql = f"UPDATE usuarios SET {', '.join(fields)} WHERE id = %s"
    current_app.logger.debug(f"Actualizando usuario {user_id} con campos: {list(data.keys())}")
    result = execute_non_query(sql, tuple(values))
    return result  # Debe retornar el número de filas afectadas

def update_fijo(usuario_id, data):
    query = """
        UPDATE usuarios
        SET nombre = %s, apellido_paterno = %s, apellido_materno = %s,
            telefono = %s, email = %s, password = %s, rol_id = %s
        WHERE id = %s
    """
    params = (
        data["nombre"], data["apellido_paterno"], data["apellido_materno"],
        data["telefono"], data["email"], data["password"], data["rol_id"],
        usuario_id
    )
    return execute_non_query(query, params)

def update_dinamico(usuario_id, data):
    fields, values = [], []
    for key, value in data.items():
        fields.append(f"{key} = %s")
        values.append(value)
    query = f"UPDATE usuarios SET {', '.join(fields)} WHERE id = %s"
    values.append(usuario_id)
    return execute_non_query(query, tuple(values))
