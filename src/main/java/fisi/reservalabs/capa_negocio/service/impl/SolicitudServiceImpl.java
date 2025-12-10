package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Empleado;
import fisi.reservalabs.capa_datos.model.Laboratorio;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_datos.model.Usuario;
import fisi.reservalabs.capa_datos.repository.EmpleadoRepository;
import fisi.reservalabs.capa_datos.repository.LaboratorioRepository;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;
import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.SolicitudMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.IReporteService;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;
import fisi.reservalabs.capa_datos.repository.UsuarioRepository;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.sql.Timestamp;
import java.util.stream.Collectors;

@Service
public class SolicitudServiceImpl implements ISolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
private EmpleadoRepository empleadoRepository;
    @Autowired
private LaboratorioRepository laboratorioRepository;
@Autowired
    private IReporteService reporteService;


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
                        s.getTipo(),
                        s.getRequerimientos()
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
    solicitud.setRequerimientos(dto.getRequerimientos());

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
public SolicitudDTO reasignarSolicitud(
        String idSolicitud,
        String fechaReserva,
        String horaInicio,
        String horaFin,
        String requerimientos
) {

    // 1. Buscar la solicitud más reciente por idSolicitud
    Solicitud solicitud = solicitudRepository
            .findTopByIdSolicitudOrderByFechaSolicitudDesc(idSolicitud)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Solicitud no encontrada con id " + idSolicitud
            ));

    // 2. Actualizar fechaReserva (mismo estilo que en crearSolicitud)
    if (fechaReserva != null && !fechaReserva.isBlank()) {
        // "yyyy-MM-dd"
        LocalDate localDate = LocalDate.parse(fechaReserva);

        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        cal.clear();
        cal.set(
                localDate.getYear(),
                localDate.getMonthValue() - 1, // Calendar usa meses 0–11
                localDate.getDayOfMonth(),
                6, 0, 0                         // misma hora que en crearSolicitud
        );
        cal.set(Calendar.MILLISECOND, 0);

        Date fechaReservaDate = cal.getTime();
        solicitud.setFechaReserva(fechaReservaDate);
    } else {
        solicitud.setFechaReserva(null);
    }

    // 3. Parsear horas (JS envía "1970-01-01T08:00:00.000Z")
    Date horaInicioDate;
    Date horaFinDate;

    try {
        if (horaInicio != null && horaInicio.contains("T")) {
            // Ej: "1970-01-01T08:00:00.000Z"
            Instant instIni = Instant.parse(horaInicio);
            Instant instFin = Instant.parse(horaFin);

            horaInicioDate = Date.from(instIni);
            horaFinDate    = Date.from(instFin);
        } else {
            // Por si algún día solo mandas "HH:mm"
            LocalTime ltIni = LocalTime.parse(horaInicio.substring(0, 5)); // HH:mm
            LocalTime ltFin = LocalTime.parse(horaFin.substring(0, 5));

            LocalDate baseDate = LocalDate.of(1970, 1, 1);
            ZoneId utc = ZoneId.of("UTC");

            horaInicioDate = Date.from(
                    LocalDateTime.of(baseDate, ltIni).atZone(utc).toInstant()
            );
            horaFinDate = Date.from(
                    LocalDateTime.of(baseDate, ltFin).atZone(utc).toInstant()
            );
        }
    } catch (DateTimeParseException ex) {
        throw new IllegalArgumentException("Formato de hora inválido", ex);
    }

    // Aquí ya son java.util.Date, compatibles con tu entity
    solicitud.setHoraInicio(horaInicioDate);
    solicitud.setHoraFin(horaFinDate);

    // 4. Requerimientos (JSON en texto)
    solicitud.setRequerimientos(requerimientos);
    solicitud.setLaboratorio(null);
    // 5. Estado y tipo según lo que pediste
    solicitud.setEstado("PENDIENTE");
    solicitud.setTipo("REASIGNACION");

    // No tocamos: idLaboratorio, motivo, fechaSolicitud, usuario, etc.

    // 6. Guardar y devolver DTO
    Solicitud guardada = solicitudRepository.save(solicitud);
    return SolicitudMapper.toDTO(guardada);
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
            .findByEmpleado_IdEmpleadoAndEstado(idEmpleado, "PENDIENTE")
            .stream()
            .map(SolicitudMapper::toDTO)
            .collect(Collectors.toList());
    }

    @Override
    public List<SolicitudDTO> listarSolicitudesPendientes() {
        return solicitudRepository.findByEstado("PENDIENTE")
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SolicitudDTO> listarSolicitudesAceptadas() {
        return solicitudRepository.findByEstado("ACEPTADA")
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
public List<SolicitudDTO> listarSolicitudesAceptadasPorTipo(String tipo) {
    return solicitudRepository.findByEstadoAndTipo("ACEPTADA", tipo)
            .stream()
            .map(SolicitudMapper::toDTO)
            .collect(Collectors.toList());
}
        @Override
    public List<SolicitudDTO> listarSolicitudesRechazadas() {
        return solicitudRepository.findByEstado("RECHAZADA")
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

    @Override
public void aceptarSolicitud(SolicitudId id, EmpleadoDTO empleadoSesion) {

    if (empleadoSesion == null) {
        throw new ResourceNotFoundException("Empleado no autenticado");
    }

    Solicitud solicitud = solicitudRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

    Empleado empleado = empleadoRepository.findById(empleadoSesion.getIdEmpleado())
            .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

    solicitud.setEmpleado(empleado);   // 👈 se llena idEmpleado
    solicitud.setEstado("ACEPTADA");

    solicitudRepository.save(solicitud);
}

@Override
    public void rechazarSolicitud(SolicitudId solicitudId, String motivo, EmpleadoDTO empleadoDTO) {

        // 1) Buscar la solicitud
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

        // 2) Actualizar estado y motivo de rechazo en la solicitud
        solicitud.setEstado("RECHAZADA");      // ajusta al enum/string que uses
        solicitud.setMotivo(motivo);   // ajusta nombre del campo si difiere
        

        // 3) Obtener el Empleado (entidad) desde el DTO
        Empleado empleado = empleadoRepository.findById(empleadoDTO.getIdEmpleado())
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
solicitud.setEmpleado(empleado);
solicitudRepository.save(solicitud);
        // 4) Crear el reporte asociado al rechazo
        reporteService.crearReportePorRechazo(solicitud, empleado, motivo);
    }

@Override
public List<SolicitudDTO> listarHistorialSolicitudes() {

    List<String> estados = Arrays.asList("ACEPTADA", "RECHAZADA");

    return solicitudRepository
            .findByEstadoInOrderByFechaSolicitudDesc(estados)
            .stream()
            .map(SolicitudMapper::toDTO)
            .collect(Collectors.toList());
}

    @Override
    public List<SolicitudDTO> listarSolicitudesAceptadasSinLaboratorio() {
        return solicitudRepository
                .findByEstadoAndLaboratorioIsNull("ACEPTADA")
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SolicitudDTO> listarSolicitudesAceptadasConLaboratorio() {
        return solicitudRepository
                .findByEstadoAndLaboratorioIsNotNull("ACEPTADA")
                .stream()
                .map(SolicitudMapper::toDTO)
                .collect(Collectors.toList());
    }
@Override
public SolicitudDTO asignarLaboratorioAGestor(String idSolicitud,
                                              Date fechaSolicitud,
                                              String idLaboratorio,
                                              EmpleadoDTO empleadoSesion) {

    // 1. PK compuesto
    SolicitudId pk = new SolicitudId(idSolicitud, fechaSolicitud);

    Solicitud solicitud = solicitudRepository.findById(pk)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Solicitud no encontrada con id " + idSolicitud + " y fecha " + fechaSolicitud
            ));

    // 2. Laboratorio
    Laboratorio laboratorio = laboratorioRepository.findById(idLaboratorio)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Laboratorio no encontrado con id " + idLaboratorio
            ));

    // 3. Empleado (quien asigna)
    Empleado empleado = empleadoRepository.findById(empleadoSesion.getIdEmpleado())
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Empleado no encontrado con id " + empleadoSesion.getIdEmpleado()
            ));

    // 4. Actualizar entidad
    solicitud.setLaboratorio(laboratorio);
    solicitud.setEmpleado(empleado);

    if ("PENDIENTE".equalsIgnoreCase(solicitud.getEstado())) {
        solicitud.setEstado("ACEPTADA");
    }

    Solicitud guardada = solicitudRepository.save(solicitud);

    return SolicitudMapper.toDTO(guardada);
}

}
