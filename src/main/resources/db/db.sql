-- Crear base de datos
CREATE DATABASE IF NOT EXISTS reservas_lab;
USE reservas_lab;

-- =====================================
-- Tabla: E_Empleado
-- =====================================
CREATE TABLE E_Empleado (
    idEmpleado VARCHAR(50) PRIMARY KEY,
    nombreCompleto VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    usuarioLogin VARCHAR(50) NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

-- =====================================
-- Tabla: E_Usuario
-- =====================================
CREATE TABLE E_Usuario (
    idUsuario VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    contraseña VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50)
);

-- =====================================
-- Tabla: E_Laboratorio
-- =====================================
CREATE TABLE E_Laboratorio (
    idLaboratorio VARCHAR(50) PRIMARY KEY,
    nombreLab VARCHAR(100) NOT NULL,
    capacidad VARCHAR(10),
    estado VARCHAR(50)
);

-- =====================================
-- Tabla: E_SolicitudAsignacion
-- =====================================
CREATE TABLE E_SolicitudAsignacion (
    idSolicitudAsignacion VARCHAR(50) NOT NULL,
    idUsuario VARCHAR(50) NOT NULL,
    idLaboratorio VARCHAR(50) NOT NULL,
    idEmpleado VARCHAR(50),
    estado VARCHAR(50) NOT NULL,
    fechaSolicitud DATETIME NOT NULL,
    fechaReserva DATETIME,
    horaInicio TIME,
    horaFin TIME,
    motivo VARCHAR(255),
    tipo VARCHAR(50),
    PRIMARY KEY (idSolicitudAsignacion, fechaSolicitud),
    FOREIGN KEY (idUsuario) REFERENCES E_Usuario(idUsuario),
    FOREIGN KEY (idLaboratorio) REFERENCES E_Laboratorio(idLaboratorio),
    FOREIGN KEY (idEmpleado) REFERENCES E_Empleado(idEmpleado)
);

-- =====================================
-- Tabla: E_Requerimiento
-- =====================================
CREATE TABLE E_Requerimiento (
    idRequerimiento VARCHAR(50) PRIMARY KEY,
    tipo VARCHAR(50),
    descripcion VARCHAR(255),
    idSolicitudAsignacion VARCHAR(50),
    CONSTRAINT fk_requerimiento_solicitud FOREIGN KEY (idSolicitudAsignacion) REFERENCES E_SolicitudAsignacion(idSolicitudAsignacion)
);

-- =====================================
-- Tabla: E_Reporte
-- =====================================
CREATE TABLE E_Reporte (
    idReporte VARCHAR(50) PRIMARY KEY,
    idEmpleado VARCHAR(50) NOT NULL,
    idSolicitudAsignacion VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255),
    tipoReporte VARCHAR(50),
    fechaEmision DATE,
    CONSTRAINT fk_reporte_empleado FOREIGN KEY (idEmpleado) REFERENCES E_Empleado(idEmpleado),
    CONSTRAINT fk_reporte_solicitud FOREIGN KEY (idSolicitudAsignacion) REFERENCES E_SolicitudAsignacion(idSolicitudAsignacion)
);
