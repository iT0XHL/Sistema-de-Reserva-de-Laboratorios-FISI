package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Empleado;
import fisi.reservalabs.capa_datos.model.Reporte;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_datos.repository.ReporteRepository;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;
import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import fisi.reservalabs.capa_negocio.mapper.ReporteMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.IReporteService;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteServiceImpl implements IReporteService {

    @Autowired
    private ReporteRepository reporteRepository;
@Autowired
private SolicitudRepository solicitudRepository;

    @Override
    public List<ReporteDTO> listarReportes() {
        return reporteRepository.findAll()
                .stream()
                .map(ReporteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReporteDTO obtenerPorId(String idReporte) {
        Reporte reporte = reporteRepository.findById(idReporte)
                .orElse(null); // o lanzar tu ResourceNotFoundException
        return ReporteMapper.toDTO(reporte);
    }

    @Override
    public ReporteDTO crearReportePorRechazo(Solicitud solicitud, Empleado empleado, String motivo) {

        Reporte reporte = new Reporte();

        // ID de reporte (haz aquí tu lógica real si tienes otra)
        String nuevoId = generarIdReporte();
        reporte.setIdReporte(nuevoId);

        // Relaciones
        reporte.setEmpleado(empleado);
        reporte.setSolicitud(solicitud);

        // Campos que vienen de la solicitud
        reporte.setDescripcion(motivo);                    // motivo del rechazo
        reporte.setTipoReporte(solicitud.getTipo()); // "ASIGNACION"/"REASIGNACION" (ajusta nombre del getter)

        // Fecha actual
        reporte.setFechaEmision(new Date());

        reporte = reporteRepository.save(reporte);

        return ReporteMapper.toDTO(reporte);
    }
    
    @Override
public ReporteDTO obtenerPorSolicitud(Solicitud solicitud) {
    Reporte reporte = reporteRepository.findBySolicitud(solicitud)
            .orElseThrow(() -> new ResourceNotFoundException("No existe reporte para esa solicitud"));
    return ReporteMapper.toDTO(reporte);
}
    // Ejemplo simple, cámbialo si ya tienes otra forma de generar IDs
    private String generarIdReporte() {
        long count = reporteRepository.count() + 1;
        return String.format("R%03d", count); // R001, R002, ...
    }

@Override
public ReporteDTO obtenerPorSolicitud(String idSolicitud, Date fechaSolicitud) {

    // 1) Construir la clave compuesta de Solicitud
    SolicitudId solicitudId = new SolicitudId(idSolicitud, fechaSolicitud);

    // 2) Buscar la entidad Solicitud
    Solicitud solicitud = solicitudRepository.findById(solicitudId)
            .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

    // 3) Buscar el reporte asociado a esa solicitud
    Reporte reporte = reporteRepository.findBySolicitud(solicitud)
            .orElseThrow(() -> new ResourceNotFoundException("No existe reporte para esa solicitud"));

    // 4) Devolver DTO
    return ReporteMapper.toDTO(reporte);
}
}
