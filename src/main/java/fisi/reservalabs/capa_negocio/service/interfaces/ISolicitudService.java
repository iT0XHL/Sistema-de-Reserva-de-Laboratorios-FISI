package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;

import java.util.Date;
import java.util.List;

public interface ISolicitudService {

    List<SolicitudDTO> listarSolicitudes();

    SolicitudDTO obtenerPorId(String idSolicitud, Date fechaSolicitud);

    SolicitudDTO crearSolicitud(SolicitudDTO dto);

    SolicitudDTO actualizarSolicitud(String idSolicitud, Date fechaSolicitud, SolicitudDTO dto);

    void eliminarSolicitud(String idSolicitud, Date fechaSolicitud);

    List<SolicitudDTO> listarSolicitudesPorUsuario(String idUsuario);

    public List<SolicitudDTO> listarSolicitudesPendientesDeEmpleado(String idEmpleado);

    List<SolicitudDTO> listarSolicitudesPorEmpleadoYTipo(String idEmpleado, String tipo);

    List<SolicitudDTO> listarSolicitudesPendientesSinLaboratorio(String idEmpleado);




}
