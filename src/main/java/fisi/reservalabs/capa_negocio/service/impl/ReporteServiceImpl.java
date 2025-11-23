package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Reporte;
import fisi.reservalabs.capa_datos.model.Empleado;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_datos.repository.ReporteRepository;
import fisi.reservalabs.capa_datos.repository.EmpleadoRepository;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;
import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.ReporteMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.IReporteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteServiceImpl implements IReporteService {

    @Autowired
    private ReporteRepository reporteRepository;

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private SolicitudRepository solicitudRepository;

    @Override
    public ReporteDTO crearReporte(ReporteDTO dto) {
        Reporte entity = ReporteMapper.toEntity(dto);

        // Cargar relaciones
        Empleado empleado = empleadoRepository.findById(dto.getIdEmpleado())
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        entity.setEmpleado(empleado);

        // Solicitud (clave compuesta)
        SolicitudId solicitudId = new SolicitudId();
        solicitudId.setIdSolicitud(dto.getIdSolicitud());
        solicitudId.setFechaSolicitud(dto.getFechaSolicitud());

        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));
        entity.setSolicitud(solicitud);

        reporteRepository.save(entity);
        return ReporteMapper.toDTO(entity);
    }

    @Override
    public List<ReporteDTO> listarReportes() {
        return reporteRepository.findAll().stream()
                .map(ReporteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReporteDTO obtenerPorId(String idReporte) {
        Reporte entity = reporteRepository.findById(idReporte)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado"));
        return ReporteMapper.toDTO(entity);
    }

    @Override
    public ReporteDTO actualizarReporte(String idReporte, ReporteDTO dto) {
        Reporte entity = reporteRepository.findById(idReporte)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado"));

        // Actualizar relaciones
        if (dto.getIdEmpleado() != null) {
            Empleado empleado = empleadoRepository.findById(dto.getIdEmpleado())
                    .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
            entity.setEmpleado(empleado);
        }

        if (dto.getIdSolicitud() != null && dto.getFechaSolicitud() != null) {
            SolicitudId solicitudId = new SolicitudId();
            solicitudId.setIdSolicitud(dto.getIdSolicitud());
            solicitudId.setFechaSolicitud(dto.getFechaSolicitud());

            Solicitud solicitud = solicitudRepository.findById(solicitudId)
                    .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));
            entity.setSolicitud(solicitud);
        }

        entity.setDescripcion(dto.getDescripcion());
        entity.setTipoReporte(dto.getTipoReporte());
        entity.setFechaEmision(dto.getFechaEmision());

        reporteRepository.save(entity);
        return ReporteMapper.toDTO(entity);
    }

    @Override
    public void eliminarReporte(String idReporte) {
        Reporte entity = reporteRepository.findById(idReporte)
                .orElseThrow(() -> new ResourceNotFoundException("Reporte no encontrado"));

        reporteRepository.delete(entity);
    }
}
