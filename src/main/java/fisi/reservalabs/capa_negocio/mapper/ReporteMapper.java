package fisi.reservalabs.capa_negocio.mapper;

import fisi.reservalabs.capa_datos.model.Reporte;
import fisi.reservalabs.capa_negocio.dto.ReporteDTO;

public class ReporteMapper {

    // ---------- ENTITY → DTO ----------
    public static ReporteDTO toDTO(Reporte entity) {
        if (entity == null) return null;

        ReporteDTO dto = new ReporteDTO();

        dto.setIdReporte(entity.getIdReporte());
        dto.setFechaSolicitud(entity.getSolicitud() != null ? entity.getSolicitud().getFechaSolicitud() : null);
        dto.setFechaEmision(entity.getFechaEmision());
        dto.setDescripcion(entity.getDescripcion());
        dto.setTipoReporte(entity.getTipoReporte());


        dto.setIdEmpleado(entity.getEmpleado() != null ? entity.getEmpleado().getIdEmpleado() : null);
        dto.setIdSolicitud(entity.getSolicitud() != null ? entity.getSolicitud().getIdSolicitud() : null);

        return dto;
    }


    public static Reporte toEntity(ReporteDTO dto) {
        if (dto == null) return null;

        Reporte entity = new Reporte();

        entity.setIdReporte(dto.getIdReporte());
        entity.setFechaEmision(dto.getFechaEmision());
        entity.setDescripcion(dto.getDescripcion());
        entity.setTipoReporte(dto.getTipoReporte());


        entity.setEmpleado(null);
        entity.setSolicitud(null);

        return entity;
    }
}
