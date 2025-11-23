package fisi.reservalabs.capa_negocio.mapper;

import fisi.reservalabs.capa_datos.model.Laboratorio;
import fisi.reservalabs.capa_negocio.dto.LaboratorioDTO;

public class LaboratorioMapper {

    public static LaboratorioDTO toDTO(Laboratorio entity) {
        if (entity == null) return null;

        LaboratorioDTO dto = new LaboratorioDTO();
        dto.setIdLaboratorio(entity.getIdLaboratorio());
        dto.setNombreLab(entity.getNombreLab());
        dto.setCapacidad(entity.getCapacidad());
        dto.setEstado(entity.getEstado());
        dto.setEspecificaciones(entity.getEspecificaciones());

        return dto;
    }

    public static Laboratorio toEntity(LaboratorioDTO dto) {
        if (dto == null) return null;

        Laboratorio entity = new Laboratorio();
        entity.setIdLaboratorio(dto.getIdLaboratorio());
        entity.setNombreLab(dto.getNombreLab());
        entity.setCapacidad(dto.getCapacidad());
        entity.setEstado(dto.getEstado());
        entity.setEspecificaciones(dto.getEspecificaciones());

        return entity;
    }
}
