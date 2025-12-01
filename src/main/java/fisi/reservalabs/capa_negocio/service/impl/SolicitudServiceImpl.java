package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_datos.model.Usuario;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.SolicitudMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;
import fisi.reservalabs.capa_datos.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.sql.Timestamp;
import java.util.stream.Collectors;
   import java.util.stream.Collectors;

@Service
public class SolicitudServiceImpl implements ISolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;

        @Override
    public List<SolicitudDTO> listarSolicitudesPorUsuario(String idUsuario) {
        return solicitudRepository.findByUsuario(idUsuario)
                .stream()
                .map(s -> new SolicitudDTO(
                        s.getIdSolicitud(),
                        s.getFechaSolicitud(),
                        s.getUsuario().getIdUsuario(),
                        s.getLaboratorio() != null ? s.getLaboratorio().getIdLaboratorio(): null,
                        s.getEmpleado() != null ? s.getEmpleado().getIdEmpleado() : null,
                        s.getEstado(),
                        s.getFechaReserva(),
                        s.getHoraInicio(),
                        s.getHoraFin(),
                        s.getMotivo(),
                        s.getTipo()
                )).toList();
    }
    @Override
    public List<SolicitudDTO> listarSolicitudes() {
        return solicitudRepository.findAll()
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SolicitudDTO obtenerPorId(String idSolicitud, Date fechaSolicitud) {
        SolicitudId pk = new SolicitudId(idSolicitud, fechaSolicitud);
        Solicitud entity = solicitudRepository.findById(pk)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));
        return SolicitudMapper.toDTO(entity);
    }

    @Override
    public SolicitudDTO crearSolicitud(SolicitudDTO dto, HttpSession session) {
    // Obtener el usuario desde la sesión
    UsuarioDTO usuarioDTO = (UsuarioDTO) session.getAttribute("usuario");

    if (usuarioDTO == null) {
        throw new ResourceNotFoundException("El usuario no está autenticado.");
    }

    // Crear una nueva entidad Solicitud
    Solicitud solicitud = new Solicitud();

    // Generar un nuevo idSolicitud de forma secuencial
    String newId = generateNextId();
    solicitud.setIdSolicitud(newId);

    Date originalFechaReserva = dto.getFechaReserva();

if (originalFechaReserva != null) {

    // 1. Tomamos la fecha seleccionada (sin hora)
    Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
    cal.setTime(originalFechaReserva);

    // 2. Fijamos hora 00:00:00 EN UTC (así no se mueve nunca el día)
    cal.set(Calendar.HOUR_OF_DAY, 6);
    cal.set(Calendar.MINUTE, 0);
    cal.set(Calendar.SECOND, 0);
    cal.set(Calendar.MILLISECOND, 0);

    solicitud.setFechaReserva(cal.getTime());

} else {
    solicitud.setFechaReserva(null);
}

    solicitud.setHoraInicio(dto.getHoraInicio());
    solicitud.setHoraFin(dto.getHoraFin());
    solicitud.setMotivo(dto.getMotivo());

    // ===== Tipo por defecto =====
    solicitud.setTipo("ASIGNACION");

    ZoneId limaZone = ZoneId.of("America/Lima");

// Hora actual en Perú
LocalDateTime ahoraLima = LocalDateTime.now(limaZone);

// Compensar las +5 horas que terminas viendo en la BD
LocalDateTime corregida = ahoraLima.minusHours(5);

// Pasar a java.util.Date sin tocar más
Date fechaSolicitud = Timestamp.valueOf(corregida);

solicitud.setFechaSolicitud(fechaSolicitud);
    // Estado por defecto
    solicitud.setEstado("PENDIENTE");

    // Asignar el usuario a la solicitud
    Usuario usuario = usuarioRepository.findById(usuarioDTO.getIdUsuario())
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

    solicitud.setUsuario(usuario);

    // Guardar la solicitud en la base de datos
    solicitudRepository.save(solicitud);

    // Retornar el DTO de la solicitud
    return SolicitudMapper.toDTO(solicitud);
}

private String generateNextId() {
    List<String> lastIds = solicitudRepository.getLastId();
    
    if (lastIds.isEmpty()) {
        return "S001"; // Si no hay solicitudes, empieza con "S001"
    }

    String lastId = lastIds.get(0); // Toma el primer resultado
    int lastNumber = Integer.parseInt(lastId.substring(1)); // Extrae el número de ID
    int nextNumber = lastNumber + 1; // Incrementa el número
    return String.format("S%03d", nextNumber); // Retorna el nuevo ID con formato "S001", "S002", etc.
}


    @Override
    public SolicitudDTO actualizarSolicitud(String idSolicitud, Date fechaSolicitud, SolicitudDTO dto) {
        SolicitudId pk = new SolicitudId(idSolicitud, fechaSolicitud);
        Solicitud entity = solicitudRepository.findById(pk)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

        // Actualizar campos
        entity.setEstado(dto.getEstado());
        entity.setFechaReserva(dto.getFechaReserva());
        entity.setHoraInicio(dto.getHoraInicio());
        entity.setHoraFin(dto.getHoraFin());
        entity.setMotivo(dto.getMotivo());
        entity.setTipo(dto.getTipo());

        solicitudRepository.save(entity);
        return SolicitudMapper.toDTO(entity);
    }

    @Override
    public List<SolicitudDTO> listarSolicitudesPendientesDeEmpleado(String idEmpleado) {
        return solicitudRepository
                .findByEmpleado_IdEmpleadoAndEstado(idEmpleado, "PENDIENTE")
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SolicitudDTO> listarSolicitudesPorEmpleadoYTipo(String idEmpleado, String tipo) {
        return solicitudRepository
                .findByEmpleado_IdEmpleadoAndTipo(idEmpleado, tipo)
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SolicitudDTO> listarSolicitudesPendientesSinLaboratorio(String idEmpleado) {

        return solicitudRepository
                .findByEmpleado_IdEmpleadoAndEstadoAndLaboratorioIsNull(
                        idEmpleado,
                        "ACEPTADA"
                )
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }





    @Override
    public void eliminarSolicitud(String idSolicitud, Date fechaSolicitud) {
        SolicitudId pk = new SolicitudId(idSolicitud, fechaSolicitud);
        Solicitud entity = solicitudRepository.findById(pk)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));
        solicitudRepository.delete(entity);
    }
}
