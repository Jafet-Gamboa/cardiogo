# CardioGo Backend

Backend de la aplicación **CardioGo**, desarrollado en **Flask** y PostgreSQL.  
Incluye autenticación con **JWT** y documentación de la API con **Swagger**.

---

## Tecnologías

- Python 3.11
- Flask
- Flask-JWT-Extended
- Flask-CORS
- Psycopg2 (PostgreSQL)
- Bcrypt
- Flasgger (Swagger)
- Git y GitLab para control de versiones

---

## Estructura del proyecto

```bash
cardiogo-backend/
├─ app/
│ ├─ init.py
│ ├─ main.py
│ ├─ controllers/
│ │ └─ user.py
│ ├─ models/
│ │ └─ user.py
│ ├─ routes/
│ │ ├─ auth.py
│ │ └─ user.py
│ ├─ utils/
│ │ └─ response.py
│ └─ docs/
│ └─ swagger.yaml
├─ venv/ (Solo en caso requerido)
├─ .env
├─ config.py
├─ run.py
└─ requirements.txt
```

---

## Instalación

1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd cardiogo-backend
```

2. Crear entorno virtual:

```bash
python -m venv venv
```

3. Activar el entorno virtual:

Windows:

```bash
venv\Scripts\activate
```

Linux / MacOS:

```bash
source venv/bin/activate
```

4. Instalar dependencias:

```bash
pip install -r requirements.txt
```

5. Configurar variables de entorno en el archivo .env:

```bash
DB_USER=postgres
DB_PASS=TuPassword
DB_HOST=localhost
DB_NAME=cardiogo
DB_PORT=5432
SECRET_KEY=clave-super-secreta
JWT_SECRET_KEY=otra-clave-super-secreta
JWT_ACCESS_TOKEN_EXPIRES=1800
JWT_REFRESH_TOKEN_EXPIRES=86400
```

6. Ejecutar la aplicación:

```bash
flask run
```

La API estará disponible en: http://127.0.0.1:5000/cardio-go/v1/

## Documentación de la API (Swagger)
Accede a la documentación interactiva en: http://127.0.0.1:5000/apidocs/

## Autenticación con JWT
1. Ir al endpoint POST /auth/login y enviar el email y password de un usuario existente.

2. Copiar el access_token recibido.

3. Hacer clic en Authorize en Swagger y pegar:

```bash
Bearer <access_token>
```

Ahora puedes probar endpoints protegidos (GET, POST, PUT, DELETE).

## Endpoints principales
1. /auth/login : Login de usuario

2. /auth/refresh : Refrescar token JWT

3. /auth/protected : Endpoint protegido

4. /users : Listar y crear usuarios

(Ver swagger.yaml para todos los detalles y ejemplos)

## Uso de Git
1. Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd cardiogo-backend
```

2. Crear una rama para tu avance:

```bash
git checkout -b feature/nombre-rama
```

3. Verificar estado de cambios:

```bash
git status
```

4. Agregar cambios al commit:

```bash
git add .
```

5. Hacer commit con mensaje descriptivo:

```bash
git commit -m "Descripción del avance"
```

6. Subir la rama al repositorio remoto:

```bash
git push origin feature/nombre-rama
```

7. En GitLab, crear un Merge Request de tu rama feature/nombre-rama hacia main y realizar el merge.

8. Para actualizar tu repositorio local con cambios del remoto (reemplaza main por la rama principal que uses si es diferente.):
```bash
git checkout main
git pull origin main
```

## Notas
Para endpoints protegidos por JWT, recuerda siempre enviar el token en el header Authorization: Bearer <token>.

Todos los endpoints devuelven respuestas con formato estándar:

```bash
{
  "status": "success",
  "data": {...}
}
```
o en caso de error:

```bash
{
  "status": "error",
  "message": "Descripción del error",
  "code": 400
}
```