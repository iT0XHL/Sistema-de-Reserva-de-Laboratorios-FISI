package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_datos.model.Empleado;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import java.util.Date;
import java.util.List;

public interface IReporteService {
        ReporteDTO crearReportePorRechazo(Solicitud solicitud, Empleado empleado, String motivo);

    List<ReporteDTO> listarReportes();
    ReporteDTO obtenerPorId(String idReporte);
    // NUEVO: reporte asociado a una solicitud
    ReporteDTO obtenerPorSolicitud(Solicitud solicitud);
        ReporteDTO obtenerPorSolicitud(String idSolicitud, Date fechaSolicitud);

}
