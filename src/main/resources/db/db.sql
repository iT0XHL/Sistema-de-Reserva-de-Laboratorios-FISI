-- Crear la base de datos
CREATE DATABASE reservas_lab;
USE reservas_lab;

-- Tabla de usuarios
CREATE TABLE Usuario (
    idUsuario VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    rol VARCHAR(50) NOT NULL
);

-- Tabla de empleados
CREATE TABLE Empleado (
    idEmpleado VARCHAR(50) PRIMARY KEY,
    nombreCompleto VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    usuarioLogin VARCHAR(50) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL
);

-- Tabla de laboratorios
CREATE TABLE Laboratorio (
    idLaboratorio VARCHAR(50) PRIMARY KEY,
    nombreLab VARCHAR(100) NOT NULL,
    capacidad VARCHAR(20) NOT NULL,
    estado VARCHAR(50) NOT NULL,
    especificaciones JSON
);

-- Tabla de solicitud de asignaciÃ³n (con PK compuesta)
CREATE TABLE Solicitud (
    idSolicitud VARCHAR(50) NOT NULL,
    idUsuario VARCHAR(50) NOT NULL,
    idLaboratorio VARCHAR(50) ,
    idEmpleado VARCHAR(50),
    estado VARCHAR(50) NOT NULL,
    fechaSolicitud DATETIME NOT NULL,
    fechaReserva DATETIME NOT NULL,
    horaInicio TIME NOT NULL,
    horaFin TIME NOT NULL,
    motivo VARCHAR(255),
    tipo VARCHAR(50),
    requerimientos JSON NULL,
    PRIMARY KEY (idSolicitud, fechaSolicitud),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idLaboratorio) REFERENCES Laboratorio(idLaboratorio),
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado)
);


-- Tabla de reportes
CREATE TABLE Reporte (
    idReporte VARCHAR(50) PRIMARY KEY,
    idEmpleado VARCHAR(50) NOT NULL,
    idSolicitud VARCHAR(50) NOT NULL,
    fechaSolicitud DATETIME NOT NULL,
    descripcion VARCHAR(255),
    tipoReporte VARCHAR(50),
    fechaEmision DATE NOT NULL,
    FOREIGN KEY (idEmpleado) REFERENCES Empleado(idEmpleado),
    FOREIGN KEY (idSolicitud, fechaSolicitud)
        REFERENCES Solicitud(idSolicitud, fechaSolicitud)
);
