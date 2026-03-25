from marshmallow import Schema, fields, validate

# -------------------- MEDICAMENTOS --------------------

class MedicamentoSchema(Schema):
    id = fields.Int(dump_only=True)
    nombre = fields.Str(required=True, validate=validate.Length(max=100))
    concentracion = fields.Str(required=True, validate=validate.Length(max=50))
    via_administracion = fields.Str(required=True, validate=validate.Length(max=50))
    principio_activo = fields.Str(required=True, validate=validate.Length(max=100))
    contenido_empaque = fields.Int(required=True)
    forma_farmaceutica = fields.Str(required=True, validate=validate.Length(max=50))
    formula_id = fields.Int(required=True)

# -------------------- RECETAS MÉDICAS --------------------

class RecetaMedicaSchema(Schema):
    id = fields.Int(dump_only=True)
    fecha_emision = fields.Date(required=True)
    indicaciones = fields.Str(required=True)
    paciente_id = fields.Int(required=True)
    medico_id = fields.Int(required=True)

# -------------------- RECETA - MEDICAMENTO --------------------

class RecetaMedicamentoSchema(Schema):
    receta_id = fields.Int(required=True)
    medicamento_id = fields.Int(required=True)
    dosis = fields.Str(required=True, validate=validate.Length(max=50))
    frecuencia = fields.Str(required=True, validate=validate.Length(max=50))
    duracion = fields.Str(required=True, validate=validate.Length(max=50))
    indicaciones_adicionales = fields.Str()