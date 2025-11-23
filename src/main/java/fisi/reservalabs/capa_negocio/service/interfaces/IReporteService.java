package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import java.util.List;
import java.util.Date;

public interface IReporteService {
    ReporteDTO crearReporte(ReporteDTO dto);
    List<ReporteDTO> listarReportes();
    ReporteDTO obtenerPorId(String idReporte);
    ReporteDTO actualizarReporte(String idReporte, ReporteDTO dto);
    void eliminarReporte(String idReporte);
}
