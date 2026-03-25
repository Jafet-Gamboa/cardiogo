DROP TYPE IF EXISTS sexo_enum;
DROP TYPE IF EXISTS estado_enum;

create type sexo_enum as enum ('Masculino', 'Femenino');
create type estado_enum as enum ('Activo', 'Inactivo');

create table roles(
    id serial primary key,
    descripcion varchar(30) not null
);

create table usuarios(
    id serial primary key,
    nombre varchar(50) not null,
    apellido_paterno varchar(50) not null,
    apellido_materno varchar(50) not null,
    telefono varchar(15),
    email varchar(100) not null unique,
    password varchar(255) not null,
    estado estado_enum default 'Activo',
    rol_id int,
    foreign key (rol_id) references roles(id)
);

create table tokens(
    id serial primary key,
    user_id int references usuarios(id),
    token text not null,
    fecha_registro timestamp default current_timestamp
);

create table cuidadores(
    id serial primary key,
    relacion_paciente varchar(50) not null,
    estado estado_enum default 'Activo',
    usuario_id int,
    foreign key (usuario_id) references usuarios(id)
);

create table personal_administrativo(
    id serial primary key,
    telefono_interno varchar(15) not null,
    estado estado_enum default 'Activo',
    usuario_id int,
    foreign key (usuario_id) references usuarios(id)
);

create table medicos(
    id serial primary key,
    cedula_profesional varchar(20) not null,
    especialidad varchar(100) not null,
    estado estado_enum default 'Activo',
    usuario_id int,
    foreign key (usuario_id) references usuarios(id)
);

create table direcciones(
    id serial primary key,
    calle varchar(100) not null,
    numero_exterior varchar(10) not null,
    numero_interior varchar(10),
    colonia varchar(100) not null,
    codigo_postal varchar(10) not null,
    estado estado_enum default 'Activo'
);

create table pacientes(
    id serial primary key,
    fecha_nacimiento date not null,
    estado_civil varchar(20),
    ocupacion varchar(50),
    sexo sexo_enum not null,
    estado estado_enum default 'Activo',
    usuario_id int,
    personal_adm_id int,
    direccion_id int,
    medico_id int,
    foreign key (medico_id) references medicos(id),
    foreign key (usuario_id) references usuarios(id),
    foreign key (personal_adm_id) references personal_administrativo(id),
    foreign key (direccion_id) references direcciones(id)
);

CREATE TABLE cuidador_paciente (
    id SERIAL PRIMARY KEY,
    cuidador_id INT REFERENCES cuidadores(id),
    paciente_id INT REFERENCES pacientes(id),
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    estado estado_enum DEFAULT 'Activo'
);

create table medicamentos(
    id serial primary key,
    nombre varchar(100) not null,
    concentracion varchar(50) not null,
    via_administracion varchar(50) not null,
    principio_activo varchar(100) not null,
    contenido_empaque int,
    forma_farmaceutica varchar(50) not null,
    estado estado_enum default 'Activo'
);

create table dispositivos(
    id serial primary key,
    numero_serie varchar(50) not null unique,
    modelo varchar(50) not null,
    marca varchar(50) not null,
    estado estado_enum not null,
    paciente_id int,
    cuidador_id int,
    foreign key (paciente_id) references pacientes(id),
    foreign key (cuidador_id) references cuidadores(id)
);

CREATE TABLE rangos_paciente (
    id serial primary key,
    paciente_id int,
    ritmo_min numeric(10,2) not null,
    ritmo_max numeric(10,2) not null,
    ritmo_unidad varchar(20) not null,
    oxigenacion_min numeric(10,2) not null,
    oxigenacion_max numeric(10,2) not null,
    oxigenacion_unidad varchar(20) not null,
    temperatura_min numeric(10,2) not null,
    temperatura_max numeric(10,2) not null,
    temperatura_unidad varchar(20) not null,
    foreign key (paciente_id) references pacientes(id)
);

create table signos_vitales(
    id serial primary key,
    ritmo_cardiaco int not null,
    oxigenacion numeric(5,2) not null,
    temperatura numeric(4,2) not null,
    fecha_hora timestamp not null,
    dispositivo_id int,
    foreign key (dispositivo_id) references dispositivos(id)
);

create table tipos_alerta(
    id serial primary key,
    nombre varchar(100) not null unique
);

create table niveles_alerta(
    id serial primary key,
    nombre varchar(50) not null unique
);

create table alertas(
    id serial primary key,
    nivel_id int,
    tipo_id int,
    longitud numeric(10,6) not null,
    latitud numeric(10,6) not null,
    fecha_hora timestamp not null,
    signos_vitales_id int,
    leido_paciente int,
    leido_cuidador int,
    foreign key (nivel_id) references niveles_alerta(id),
    foreign key (tipo_id) references tipos_alerta(id),
    foreign key (signos_vitales_id) references signos_vitales(id)
);

create table medico_dispositivo(
    medico_id int,
    dispositivo_id int,
    foreign key (medico_id) references medicos(id),
    foreign key (dispositivo_id) references dispositivos(id)
);

create table recetas_medicas(
    id serial primary key,
    fecha_emision date not null,
    indicaciones text not null,
    paciente_id int,
    medico_id int,
    estado estado_enum default 'Activo',
    foreign key (paciente_id) references pacientes(id),
    foreign key (medico_id) references medicos(id)
);

create table receta_medicamento(
    receta_id int,
    medicamento_id int,
    dosis varchar(50) not null,
    frecuencia varchar(50) not null,
    duracion varchar(50) not null,
    indicaciones_adicionales text,
    estado estado_enum default 'Activo',
    foreign key (receta_id) references recetas_medicas(id),
    foreign key (medicamento_id) references medicamentos(id)
);

INSERT INTO roles (descripcion) VALUES
('Administrador'),
('Médico'),
('Paciente'),
('Cuidador'),
('Personal Administrativo');

INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, telefono, email, password, rol_id, estado) VALUES
('Juan', 'Pérez', 'López', '6647865463', 'juan.perez@example.com', '123456', 2, 'Activo'),
('Andrea', 'Mendoza', 'Castro', '6647865464', 'andrea.mendoza@example.com', '123456', 2 , 'Activo'),
('Roberto', 'Díaz', 'Ramírez', '6647865465', 'roberto.diaz@example.com', '123456', 2 , 'Activo'),
('María', 'García', 'Hernández', '6647865466', 'maria.garcia@example.com', '123456', 3 , 'Activo'),
('Pedro', 'Sánchez', 'Ortiz', '6647865467', 'pedro.sanchez@example.com', '123456', 3 , 'Activo'),
('Lucía', 'Torres', 'Jiménez', '6647865468', 'lucia.torres@example.com', '123456', 3 , 'Activo'),
('Diego', 'Martínez', 'Rojas', '6647865469', 'diego.martinez@example.com', '123456', 3 , 'Activo'),
('Fernanda', 'Flores', 'Aguilar', '6647865470', 'fernanda.flores@example.com', '123456', 3 , 'Activo'),
('Luis', 'Ramírez', 'Torres', '6647865471', 'luis.ramirez@example.com', '123456', 4 , 'Activo'),
('Claudia', 'Navarro', 'Gómez', '6647865472', 'claudia.navarro@example.com', '123456', 4 , 'Activo'),
('Sofía', 'Mendoza', 'Ruiz', '6647865473', 'sofia.mendoza@example.com', '123456', 4 , 'Activo'),
('Javier', 'Castillo', 'Luna', '6647865474', 'javier.castillo@example.com', '123456', 4 , 'Activo'),
('Patricia', 'Gómez', 'Salinas', '6647865475', 'patricia.gomez@example.com', '123456', 4 , 'Activo'),
('Ana', 'Martínez', 'Soto', '6647865476', 'ana.martinez@example.com', '123456', 5 ,'Activo'),
('Héctor', 'Domínguez', 'Suárez', '6647865477', 'hector.dominguez@example.com', '123456', 5 ,'Activo'),
('Carlos', 'Jiménez', 'Flores', '6647865478', 'carlos.jimenez@example.com', '123456', 1 ,'Activo');

INSERT INTO cuidadores (relacion_paciente, usuario_id, estado) VALUES
('Familiar', 9 ,'Activo'),
('Familiar', 10 ,'Activo'),
('Familiar', 11 ,'Activo'),
('Familiar', 12 ,'Activo'),
('Familiar', 13 ,'Activo');

INSERT INTO personal_administrativo (telefono_interno, usuario_id, estado) VALUES
('101', 14 ,'Activo'),
('102', 15 ,'Activo');

INSERT INTO medicos (cedula_profesional, especialidad, usuario_id, estado) VALUES
('1234567', 'Cardiología', 1,'Activo'),
('7654321', 'Medicina Interna', 2 ,'Activo'),
('1112223', 'Geriatría', 3 ,'Activo');

INSERT INTO direcciones (calle, numero_exterior, numero_interior, colonia, codigo_postal, estado) VALUES
('Av. Reforma', '123', '2B', 'Centro', '06000', 'Activo'),
('Insurgentes Sur', '456', NULL, 'Del Valle', '03100' , 'Activo'),
('Av. Juárez', '789', '5A', 'Roma Norte', '06700' , 'Activo'),
('Calzada Tlalpan', '321', NULL, 'Portales', '03500' , 'Activo'),
('Eje Central', '654', NULL, 'Doctores', '06720' , 'Activo');

INSERT INTO pacientes (fecha_nacimiento, estado_civil, ocupacion, sexo, usuario_id, personal_adm_id, direccion_id, medico_id,estado) VALUES
('1985-07-15', 'Casado', 'Ingeniero', 'Masculino', 4, 1, 1, 1 ,'Activo'),
('1992-03-10', 'Soltero', 'Profesor', 'Masculino', 5, 2, 2, 2, 'Activo'),
('1978-11-20', 'Casada', 'Abogada', 'Femenino', 6, 2, 3, 3, 'Activo' ),
('2000-06-25', 'Soltero', 'Estudiante', 'Masculino', 7, 2, 4, 1,'Activo'),
('1965-01-05', 'Viuda', 'Ama de casa', 'Femenino', 8, 1, 5, 2,'Activo');

INSERT INTO cuidador_paciente (cuidador_id, paciente_id, fecha_asignacion,estado) VALUES
(1, 1, '2025-10-01','Activo'),
(2, 2, '2025-10-03','Activo'),
(3, 3, '2025-10-05','Activo'),
(4, 4, '2025-10-07','Activo'),
(5, 5, '2025-10-09','Activo');

INSERT INTO medicamentos 
(nombre, concentracion, via_administracion, principio_activo, contenido_empaque, forma_farmaceutica,estado) VALUES
('Tylenol', '500 mg', 'Oral', 'Paracetamol', 20, 'Tableta','Activo'),
('Amoxil', '500 mg', 'Oral', 'Amoxicilina', 14, 'Tableta' ,'Activo'),
('Humulin R', '100 UI/ml', 'Subcutánea', 'Insulina Humana', 5, 'Inyección','Activo'),
('Claritin Jarabe', '5 mg/5 ml', 'Oral', 'Loratadina', 1, 'Jarabe','Activo'),
('Advil', '250 mg', 'Oral', 'Ibuprofeno', 10, 'Cápsula','Activo'),
('Aspirina', '500 mg', 'Oral', 'Ácido Acetilsalicílico', 20, 'Tableta','Activo'),
('Ventolin', '100 mcg/dosis', 'Inhalación', 'Salbutamol', 1, 'Inhalador','Activo'),
('Prednisona', '20 mg', 'Oral', 'Prednisona', 10, 'Tableta','Activo'),
('Zyrtec', '10 mg', 'Oral', 'Cetirizina', 14, 'Tableta','Activo'),
('Omeprazol', '20 mg', 'Oral', 'Omeprazol', 28, 'Cápsula','Activo');

INSERT INTO dispositivos (numero_serie, modelo, marca, estado, paciente_id, cuidador_id) VALUES
('DEV12345', 'CardioMonitor X1', 'MedTech', 'Activo', 1, 1),
('DEV67890', 'HeartCare Pro', 'BioHealth', 'Activo', 2, 2),
('DEV54321', 'VitalCheck S2', 'HealthCorp', 'Activo', 3, 3),
('DEV98765', 'OxigenMax', 'LifePlus', 'Activo', 4, 4),
('DEV11223', 'CardioBand', 'FitHealth', 'Activo', 5, 5);

INSERT INTO rangos_paciente (paciente_id, ritmo_min, ritmo_max, ritmo_unidad, oxigenacion_min, oxigenacion_max, oxigenacion_unidad, temperatura_min, temperatura_max, temperatura_unidad) VALUES
(1, 60, 100, 'lpm', 95, 100, '%', 36.0, 37.5, '°C'),
(2, 55, 95, 'lpm', 94, 100, '%', 36.0, 37.4, '°C'),
(3, 60, 90, 'lpm', 93, 100, '%', 36.1, 37.3, '°C'),
(4, 70, 110, 'lpm', 96, 100, '%', 36.0, 37.6, '°C'),
(5, 58, 98, 'lpm', 95, 100, '%', 35.9, 37.2, '°C');

INSERT INTO signos_vitales (ritmo_cardiaco, oxigenacion, temperatura, fecha_hora, dispositivo_id) VALUES
(80, 98.5, 36.8, '2025-09-23 10:00:00', 1),
(95, 97.2, 37.1, '2025-09-22 09:30:00', 2),
(70, 99.1, 36.5, '2025-09-21 14:15:00', 3),
(100, 96.8, 38.0, '2025-09-20 18:45:00', 4),
(65, 98.9, 36.2, '2025-09-19 07:20:00', 5);

INSERT INTO tipos_alerta (nombre) VALUES
('Ritmo Cardiaco Alto'),
('Ritmo Cardiaco Bajo'),
('Oxigenación Baja'),
('Oxigenacion Alta'),
('Temperatura Baja'),
('Temperatura Alta');

INSERT INTO niveles_alerta (nombre) VALUES
('Advertencia'),
('Moderado'),
('Crítico');

INSERT INTO alertas (nivel_id, tipo_id, longitud, latitud, fecha_hora, signos_vitales_id) VALUES
(2, 1, -99.133200, 19.432600, '2025-09-23 10:05:00', 1),
(3, 2, -99.141000, 19.430000, '2025-09-22 09:35:00', 2),
(1, 3, -99.120000, 19.440000, '2025-09-21 14:20:00', 3),
(3, 4, -99.150000, 19.420000, '2025-09-20 18:50:00', 4);

INSERT INTO medico_dispositivo (medico_id, dispositivo_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(1, 4),
(2, 5);

INSERT INTO recetas_medicas (fecha_emision, indicaciones, paciente_id, medico_id,estado) VALUES
('2025-09-23', 'Tomar un analgésico cada 8 horas después de comidas.', 1, 1,'Activo'),
('2025-09-22', 'Administrar insulina antes de cada comida.', 2, 2,'Activo'),
('2025-09-21', 'Tomar antibiótico cada 12 horas.', 3, 3,'Activo'),
('2025-09-20', 'Consumir jarabe para alergia en la mañana.', 4, 1,'Activo'),
('2025-09-19', 'Tomar cápsula para dolor de cabeza cuando sea necesario.', 5, 2,'Activo'),
('2025-10-01', 'Tomar medicamento para alergia y dolor de cabeza.', 1, 2,'Activo'),
('2025-10-02', 'Administrar inhalador y analgésico según síntomas.', 2, 3,'Activo'),
('2025-10-03', 'Controlar acidez estomacal y tomar antiinflamatorio.', 3, 1,'Activo');

INSERT INTO receta_medicamento (receta_id, medicamento_id, dosis, frecuencia, duracion, indicaciones_adicionales, estado) VALUES
(1, 1, '1 tableta', 'Cada 8 horas', '5 días', 'No tomar con alcohol','Activo'),
(2, 3, '10 unidades', 'Cada 12 horas', '7 días', 'Mantener en refrigeración','Activo'),
(3, 2, '1 tableta', 'Cada 12 horas', '7 días', 'Completar tratamiento','Activo'),
(4, 4, '10 ml', 'Cada 8 horas', '10 días', 'No combinar con alcohol','Activo'),
(5, 5, '1 cápsula', 'Cada 12 horas', '5 días', 'Antes de comer','Activo'),
(6, 1, '1 tableta', 'Cada 8 horas', '5 días', 'No tomar con alcohol','Activo'),
(6, 4, '1 tableta', 'Cada 24 horas', '7 días', 'Evitar exposición solar','Activo'),
(7, 5, '1 cápsula', 'Cada 8 horas', '3 días', 'Después de comidas','Activo'),
(7, 2, '10 unidades', 'Cada 12 horas', '5 días', 'Mantener en refrigeración','Activo'),
(7, 6, '1 tableta', 'Cada 8 horas', '5 días', 'No combinar con alcohol','Activo'),
(8, 7, '1 tableta', 'Cada 12 horas', '7 días', 'Completar tratamiento','Activo'),
(8, 8, '1 tableta', 'Cada 8 horas', '10 días', 'Evitar exposición solar','Activo'),
(8, 9, '1 cápsula', 'Cada 8 horas', '28 días', 'Tomar en ayunas','Activo');

INSERT INTO signos_vitales 
(ritmo_cardiaco, oxigenacion, temperatura, fecha_hora, dispositivo_id)
VALUES
(130, 98.0, 36.8, '2025-09-24 08:00:00', 1),
(80, 88.0, 36.8, '2025-09-24 09:00:00', 1),
(80, 98.0, 36.8, '2025-09-24 10:00:00', 1),
(80, 98.0, 39.0, '2025-09-24 11:00:00', 1),
(40, 98.0, 36.8, '2025-09-24 12:00:00', 1);

INSERT INTO signos_vitales 
(ritmo_cardiaco, oxigenacion, temperatura, fecha_hora, dispositivo_id)
VALUES
(80, 98.0, 36.8, '2025-09-25 08:00:00', 1),
(120, 98.0, 36.8, '2025-09-25 09:00:00', 1),
(80, 92.0, 36.8, '2025-09-25 10:00:00', 1);

INSERT INTO signos_vitales 
(ritmo_cardiaco, oxigenacion, temperatura, fecha_hora, dispositivo_id)
VALUES
(80, 98.0, 36.8, '2025-09-26 08:00:00', 1),
(80, 98.0, 38.0, '2025-09-26 09:00:00', 1),
(50, 98.0, 36.8, '2025-09-26 10:00:00', 1),
(80, 98.0, 36.8, '2025-09-26 11:00:00', 1),
(80, 93.0, 36.8, '2025-09-26 12:00:00', 1),
(110, 98.0, 36.8, '2025-09-26 13:00:00', 1);

INSERT INTO alertas (nivel_id, tipo_id, longitud, latitud, fecha_hora, signos_vitales_id, leido_paciente, leido_cuidador) VALUES
(3, 1, -99.133201, 19.432601, '2025-09-24 08:00:00', 6, 0, 0),
(3, 5, -99.133202, 19.432602, '2025-09-24 09:00:00', 7, 0, 0),
(3, 3, -99.133203, 19.432603, '2025-09-24 10:00:00', 8, 0, 0),
(3, 6, -99.133204, 19.432604, '2025-09-24 11:00:00', 9, 0, 0),
(3, 2, -99.133205, 19.432605, '2025-09-24 12:00:00', 10, 0, 0);

INSERT INTO alertas (nivel_id, tipo_id, longitud, latitud, fecha_hora, signos_vitales_id, leido_paciente, leido_cuidador) VALUES
(2, 4, -99.133206, 19.432606, '2025-09-25 08:00:00', 11, 0, 0),
(2, 1, -99.133207, 19.432607, '2025-09-25 09:00:00', 12, 0, 0),
(2, 5, -99.133208, 19.432608, '2025-09-25 10:00:00', 13, 0, 0);

INSERT INTO alertas (nivel_id, tipo_id, longitud, latitud, fecha_hora, signos_vitales_id, leido_paciente, leido_cuidador) VALUES
(1, 3, -99.133209, 19.432609, '2025-09-26 08:00:00', 14, 0, 0),
(1, 6, -99.133210, 19.432610, '2025-09-26 09:00:00', 15, 0, 0),
(1, 2, -99.133211, 19.432611, '2025-09-26 10:00:00', 16, 0, 0),
(1, 4, -99.133212, 19.432612, '2025-09-26 11:00:00', 17, 0, 0),
(1, 5, -99.133213, 19.432613, '2025-09-26 12:00:00', 18, 0, 0),
(1, 1, -99.133214, 19.432614, '2025-09-26 13:00:00', 19, 0, 0);

CREATE EXTENSION IF NOT EXISTS unaccent;
