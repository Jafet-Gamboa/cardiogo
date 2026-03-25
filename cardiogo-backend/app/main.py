import psycopg2
from psycopg2.extras import RealDictCursor
from config import Config

def get_db():
    return psycopg2.connect(
        host=Config.DB_HOST,
        port=Config.DB_PORT,
        dbname=Config.DB_NAME,
        user=Config.DB_USER,
        password=Config.DB_PASSWORD,
        cursor_factory=RealDictCursor
    )

def execute_query(query, params=None):
    with get_db() as db:
        with db.cursor() as cursor:
            cursor.execute(query, params)
            return [dict(r) for r in cursor.fetchall()]

def execute_one(query, params=None):
    with get_db() as db:
        with db.cursor() as cursor:
            cursor.execute(query, params)
            row = cursor.fetchone()
            return dict(row) if row else None

def execute_insert(query, params=None):
    with get_db() as db:
        with db.cursor() as cursor:
            cursor.execute(query, params)
            last_id = cursor.fetchone()["id"] if cursor.description else None
        db.commit()
        return last_id

def execute_update(query, params=None):
    with get_db() as db:
        with db.cursor() as cursor:
            cursor.execute(query, params)
            db.commit()
            return cursor.rowcount

def execute_delete(query, params=None):
    return execute_update(query, params)

def execute_non_query(query, params=None):
    with get_db() as db:
        with db.cursor() as cursor:
            cursor.execute(query, params)
        db.commit()
