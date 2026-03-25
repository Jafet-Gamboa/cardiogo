from app.main import execute_query, execute_one, execute_insert, execute_non_query

def save_token(data):
    user_id = data["user_id"]
    token = data["token"]

    existe = execute_one("""
        SELECT id FROM tokens
        WHERE user_id = %s AND token = %s
    """, (user_id, token))

    if existe:
        return existe["id"]

    return execute_insert("""
        INSERT INTO tokens (user_id, token)
        VALUES (%s, %s)
        RETURNING id;
    """, (user_id, token))

def get_by_user_id(user_id):
    return execute_query("""
        SELECT id, user_id, token, fecha_registro
        FROM tokens
        WHERE user_id = %s;
    """, (user_id,))

def get_tokens_by_patient(paciente_id):
    return execute_query("""
        SELECT dt.token
        FROM tokens dt
        JOIN cuidadores c ON c.user_id = dt.user_id
        JOIN cuidador_paciente cp ON cp.cuidador_id = c.id
        WHERE cp.paciente_id = %s;
    """, (paciente_id,))


def delete_token(token):
    return execute_non_query("""
        DELETE FROM tokens
        WHERE token = %s;
    """, (token,))
