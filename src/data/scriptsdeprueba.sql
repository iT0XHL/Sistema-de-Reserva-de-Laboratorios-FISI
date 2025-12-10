INSERT INTO Usuario (idUsuario, nombre, usuario, contrasena, correo, telefono, rol)
VALUES (
    'U001',                 -- idUsuario
    'Juan Pérez',           -- nombre
    'juanp',                -- usuario para login
    '$2a$10$n2DSX7biqXfAvc5VPhjZHuj/dZqOunan4Hdwy0OgVoB857uSNzoj2', -- contraseña encriptada
    'juanp@gmail.com',      -- correo
    '987654321',            -- telefono
    'ADMIN'                 -- rol
);

use reservas_lab;
select * from usuario;


use reservas_lab;
INSERT INTO Laboratorio (idLaboratorio, nombreLab, capacidad, estado, especificaciones)
VALUES
('L001', 'Laboratorio de Computación 1', '40', 'ACTIVO', 
    JSON_OBJECT(
        'equipos', 40,
        'software', JSON_ARRAY(
            'Windows 10',
            'Microsoft Office 2019',
            'Eclipse IDE',
            'IntelliJ IDEA Community',
            'MySQL Workbench',
            'Visual Studio Code'
        )
    )
),
('L002', 'Laboratorio de Redes', '35', 'ACTIVO', 
    JSON_OBJECT(
        'equipos', 35,
        'software', JSON_ARRAY(
            'Cisco Packet Tracer',
            'Wireshark',
            'GNS3',
            'Ubuntu 22.04',
            'Putty'
        )
    )
),
('L003', 'Laboratorio Avanzado de IA', '25', 'ACTIVO',
    JSON_OBJECT(
        'equipos', 25,
        'software', JSON_ARRAY(
            'Python 3.10',
            'Anaconda',
            'TensorFlow',
            'PyTorch',
            'Jupyter Notebook',
            'RStudio'
        )
    )
);
INSERT INTO Empleado (
    idEmpleado, nombreCompleto, correo, usuarioLogin, contrasena, cargo
) VALUES
('EMP001', 'Carlos Ramirez', 'carlos.ramirez@fisi.edu', 'carlosr',
    '$2a$10$zu1Pi0LltpMzd9I8gCMA1OVQm2twTWFXTA3p367aHkK/3c3yN3jAS',   -- contraseña encriptada
    'Coordinador de Laboratorio'
),
('EMP002', 'María Fernández', 'maria.fernandez@fisi.edu', 'mariaf',
    '$2a$10$zu1Pi0LltpMzd9I8gCMA1OVQm2twTWFXTA3p367aHkK/3c3yN3jAS',   -- misma clave encriptada para ejemplo
    'Asistente de Laboratorio'
);
use reservas_lab;
select * from Empleado;
select * from laboratorio;


-- Solicitud 1
INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S001', 'U001', 'L001', 'EMP001', 'ACEPTADA',
    '2024-11-19 10:20:00', '2024-11-21 00:00:00', '10:00:00', '12:00:00',
    'Reserva para clase práctica', 'PRACTICA'
);

-- Solicitud 2
INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S002', 'U001', 'L002', 'EMP001', 'PENDIENTE',
    '2024-11-20 09:15:00', '2024-11-22 00:00:00', '14:00:00', '16:00:00',
    'Revisión de proyecto final', 'PROYECTO'
);

-- Solicitud 3
INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S003', 'U001', 'L001', 'EMP002', 'RECHAZADA',
    '2024-11-21 13:45:00', '2024-11-25 00:00:00', '08:00:00', '10:00:00',
    'Conflicto de horario', 'PRACTICA'
);

-- Solicitud 4
INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S004', 'U001', 'L003', 'EMP002', 'ACEPTADA',
    '2024-11-22 11:30:00', '2024-11-23 00:00:00', '12:00:00', '14:00:00',
    'Clase de laboratorio avanzado', 'LAB'
);

-- Solicitud 5
INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S005', 'U001', 'L002', 'EMP003', 'PENDIENTE',
    '2024-11-23 16:10:00', '2024-11-27 00:00:00', '09:00:00', '11:00:00',
    'Uso para investigación', 'INVESTIGACION'
);

INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S006', 'U001', 'L002', 'EMP001', 'PENDIENTE',
    '2024-11-23 16:10:00', '2024-11-27 00:00:00', '09:00:00', '11:00:00',
    'Uso para investigación', 'REASIGNACION'
);

INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S007', 'U001', null, 'EMP001', 'PENDIENTE',
    '2024-11-23 16:10:00', '2024-11-27 00:00:00', '09:00:00', '11:00:00',
    'Uso para investigación', 'ASIGNACION'
);
INSERT INTO Solicitud (
    idSolicitud, idUsuario, idLaboratorio, idEmpleado, estado,
    fechaSolicitud, fechaReserva, horaInicio, horaFin, motivo, tipo
) VALUES (
    'S008', 'U001', null, 'EMP001', 'ACEPTADA',
    '2024-11-23 16:10:00', '2024-11-27 00:00:00', '09:00:00', '11:00:00',
    'Uso para investigación', 'ASIGNACION'
);
use reservas_lab;