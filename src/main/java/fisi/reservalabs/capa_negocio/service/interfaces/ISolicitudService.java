package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import jakarta.servlet.http.HttpSession;

import java.util.Date;
import java.util.List;

public interface ISolicitudService {

    List<SolicitudDTO> listarSolicitudes();

    SolicitudDTO obtenerPorId(String idSolicitud, Date fechaSolicitud);

    SolicitudDTO crearSolicitud(SolicitudDTO dto, HttpSession session);

SolicitudDTO reasignarSolicitud(
            String idSolicitud,
            String fechaReserva,
            String horaInicio,
            String horaFin,
            String requerimientos
    );
    void eliminarSolicitud(String idSolicitud, Date fechaSolicitud);

    List<SolicitudDTO> listarSolicitudesPorUsuario(String idUsuario);

    public List<SolicitudDTO> listarSolicitudesPendientesDeEmpleado(String idEmpleado);

    List<SolicitudDTO> listarSolicitudesPorEmpleadoYTipo(String idEmpleado, String tipo);

    List<SolicitudDTO> listarSolicitudesPendientesSinLaboratorio(String idEmpleado);

    List<SolicitudDTO> listarSolicitudesPendientes();

    List<SolicitudDTO> listarSolicitudesAceptadas();

    List<SolicitudDTO> listarSolicitudesRechazadas();

    List<SolicitudDTO> listarSolicitudesAceptadasSinLaboratorio();
    
    List<SolicitudDTO> listarSolicitudesAceptadasConLaboratorio();

    void aceptarSolicitud(SolicitudId id, EmpleadoDTO empleadoSesion);

    void rechazarSolicitud(SolicitudId id, String motivo, EmpleadoDTO empleadoSesion);

List<SolicitudDTO> listarHistorialSolicitudes();
SolicitudDTO asignarLaboratorioAGestor(String idSolicitud,
                                       Date fechaSolicitud,
                                       String idLaboratorio,
                                       EmpleadoDTO empleadoSesion);

    List<SolicitudDTO> listarSolicitudesAceptadasPorTipo(String tipo);
               
}
