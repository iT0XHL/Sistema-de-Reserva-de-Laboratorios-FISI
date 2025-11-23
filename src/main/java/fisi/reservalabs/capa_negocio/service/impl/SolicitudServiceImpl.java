package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.SolicitudMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
   import java.util.stream.Collectors;

@Service
public class SolicitudServiceImpl implements ISolicitudService {

    @Autowired
    private SolicitudRepository solicitudRepository;


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
    public SolicitudDTO crearSolicitud(SolicitudDTO dto) {
        Solicitud entity = SolicitudMapper.toEntity(dto);
        // Aqui se debe setear usuario, empleado, laboratorio desde repositorios si es necesario
        solicitudRepository.save(entity);
        return SolicitudMapper.toDTO(entity);
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
