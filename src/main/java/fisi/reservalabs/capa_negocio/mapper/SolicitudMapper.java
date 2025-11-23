package fisi.reservalabs.capa_negocio.mapper;

import fisi.reservalabs.capa_datos.model.*;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;

public class SolicitudMapper {

   
    public static SolicitudDTO toDTO(Solicitud entity) {
        if (entity == null) return null;

        SolicitudDTO dto = new SolicitudDTO();

        dto.setIdSolicitud(entity.getIdSolicitud());
        dto.setFechaSolicitud(entity.getFechaSolicitud());

        dto.setIdUsuario(entity.getUsuario() != null ? entity.getUsuario().getIdUsuario() : null);
        dto.setIdLaboratorio(entity.getLaboratorio() != null ? entity.getLaboratorio().getIdLaboratorio() : null);
        dto.setIdEmpleado(entity.getEmpleado() != null ? entity.getEmpleado().getIdEmpleado() : null);

        dto.setEstado(entity.getEstado());
        dto.setFechaReserva(entity.getFechaReserva());
        dto.setHoraInicio(entity.getHoraInicio());
        dto.setHoraFin(entity.getHoraFin());
        dto.setMotivo(entity.getMotivo());
        dto.setTipo(entity.getTipo());

        return dto;
    }

 
    public static Solicitud toEntity(SolicitudDTO dto) {
        if (dto == null) return null;

        Solicitud entity = new Solicitud();

        entity.setIdSolicitud(dto.getIdSolicitud());
        entity.setFechaSolicitud(dto.getFechaSolicitud());

        entity.setUsuario(null);
        entity.setLaboratorio(null);
        entity.setEmpleado(null);

        entity.setEstado(dto.getEstado());
        entity.setFechaReserva(dto.getFechaReserva());
        entity.setHoraInicio(dto.getHoraInicio());
        entity.setHoraFin(dto.getHoraFin());
        entity.setMotivo(dto.getMotivo());
        entity.setTipo(dto.getTipo());

        return entity;
    }
}
