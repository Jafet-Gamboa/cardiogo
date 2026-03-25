from marshmallow import Schema, fields, validate

# -------------------- DISPOSITIVOS --------------------

class DispositivoSchema(Schema):
    id = fields.Int(dump_only=True)
    numero_serie = fields.Str(required=True, validate=validate.Length(max=50))
    modelo = fields.Str(required=True, validate=validate.Length(max=50))
    marca = fields.Str(required=True, validate=validate.Length(max=50))
    paciente_id = fields.Int(required=True)
    cuidador_id = fields.Int(required=True)

# -------------------- RANGOS NORMALES --------------------

class RangoNormalSchema(Schema):
    id = fields.Int(dump_only=True)
    parametro = fields.Str(required=True, validate=validate.Length(max=50))
    valor_minimo = fields.Decimal(as_string=True, required=True)
    valor_maximo = fields.Decimal(as_string=True, required=True)
    unidad = fields.Str(required=True, validate=validate.Length(max=20))

# -------------------- SIGNOS VITALES --------------------

class SignoVitalSchema(Schema):
    id = fields.Int(dump_only=True)
    ritmo_cardiaco = fields.Int(required=True)
    presion_arterial_sistolica = fields.Int(required=True)
    presion_arterial_distolica = fields.Int(required=True)
    oxigenacion = fields.Decimal(as_string=True, required=True)
    temperatura = fields.Decimal(as_string=True, required=True)
    fecha_hora = fields.DateTime(required=True)
    dispositivo_id = fields.Int(required=True)
    rangos_normales_id = fields.Int(required=True)

# -------------------- TIPOS ALERTA --------------------

class TipoAlertaSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))

# -------------------- NIVELES ALERTA --------------------

class NivelAlertaSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=50))

# -------------------- ALERTAS --------------------

class AlertaSchema(Schema):
    id = fields.Int(dump_only=True)
    nivel_id = fields.Int(required=True)
    tipo_id = fields.Int(required=True)
    longitud = fields.Decimal(as_string=True, required=True)
    latitud = fields.Decimal(as_string=True, required=True)
    fecha_hora = fields.DateTime(required=True)
    signos_vitales_id = fields.Int(required=True)

# -------------------- MEDICO-DISPOSITIVO (RELACIÓN) --------------------

class MedicoDispositivoSchema(Schema):
    medico_id = fields.Int(required=True)
    dispositivo_id = fields.Int(required=True)