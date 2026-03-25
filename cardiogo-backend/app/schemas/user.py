from marshmallow import Schema, fields, validate

# -------------------- BASE / ENUM --------------------

class SexoEnum:
    MASCULINO = "Masculino"
    FEMENINO = "Femenino"

# -------------------- ROLES --------------------

class RolSchema(Schema):
    id = fields.Int(dump_only=True)
    descripcion = fields.Str(required=True, validate=validate.Length(max=30))

# -------------------- USUARIOS --------------------

class UsuarioBaseSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=50))
    apellido_paterno = fields.Str(required=True, validate=validate.Length(max=50))
    apellido_materno = fields.Str(required=True, validate=validate.Length(max=50))
    telefono = fields.Str(validate=validate.Length(max=15))
    email = fields.Email(required=True, validate=validate.Length(max=100))
    password = fields.Str(required=True, load_only=True, validate=validate.Length(max=255))
    rol_id = fields.Int(required=True)

class UsuarioSchema(UsuarioBaseSchema):
    rol = fields.Nested(RolSchema, dump_only=True)
    paciente = fields.Nested("PacienteSchema", dump_only=True)

# -------------------- CUIDADORES --------------------

class CuidadorSchema(Schema):
    id = fields.Int(dump_only=True)
    relacion_paciente = fields.Str(required=True, validate=validate.Length(max=50))
    usuario_id = fields.Int(required=True)
    usuario = fields.Nested(UsuarioSchema, dump_only=True)

# -------------------- PERSONAL ADMIN --------------------

class PersonalAdministrativoSchema(Schema):
    id = fields.Int(dump_only=True)
    telefono_interno = fields.Str(required=True, validate=validate.Length(max=15))
    usuario_id = fields.Int(required=True)
    usuario = fields.Nested(UsuarioSchema, dump_only=True)

# -------------------- DIRECCIONES --------------------

class DireccionSchema(Schema):
    id = fields.Int(dump_only=True)
    calle = fields.Str(required=True, validate=validate.Length(max=100))
    numero_exterior = fields.Str(required=True, validate=validate.Length(max=10))
    numero_interior = fields.Str(validate=validate.Length(max=10))
    colonia = fields.Str(required=True, validate=validate.Length(max=100))
    codigo_postal = fields.Str(required=True, validate=validate.Length(max=10))

# -------------------- MEDICOS --------------------

class MedicoSchema(Schema):
    id = fields.Int(dump_only=True)
    cedula_profesional = fields.Str(required=True, validate=validate.Length(max=20))
    especialidad = fields.Str(required=True, validate=validate.Length(max=100))
    usuario_id = fields.Int(required=True)
    usuario = fields.Nested(UsuarioSchema, dump_only=True)

# -------------------- PACIENTES --------------------

class PacienteSchema(Schema):
    id = fields.Int(dump_only=True)
    fecha_nacimiento = fields.Date(required=True)
    estado_civil = fields.Str(required=True, validate=validate.Length(max=20))
    ocupacion = fields.Str(required=True, validate=validate.Length(max=50))
    sexo = fields.Str(required=True, validate=validate.OneOf([SexoEnum.MASCULINO, SexoEnum.FEMENINO]))
    direccion_id = fields.Int(required=True)
    usuario_id = fields.Int(required=True)
    personal_adm_id = fields.Int(required=True)