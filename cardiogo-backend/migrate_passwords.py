# migrate_passwords.py
import bcrypt
from app.models import user as user_model
from app import create_app  # Asegúrate de tener una función para crear la app 

def migrate_passwords(default_password="123456"):
    """
    Actualiza todas las contraseñas de la base de datos con bcrypt.
    default_password: la contraseña que tenían los usuarios antes.
    """
    usuarios = user_model.get_all()
    
    for u in usuarios:
        # Generar hash bcrypt
        hashed = bcrypt.hashpw(default_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        # Actualizar la DB
        user_model.update_password(u["usuario_id"], hashed)
        print(f"Usuario {u['usuario_email']} actualizado")

if __name__ == "__main__":
    app = create_app()  # Crea la instancia de la app Flask
    with app.app_context():  # Activa el contexto de la app
        migrate_passwords()
        print("¡Migración completada!")
