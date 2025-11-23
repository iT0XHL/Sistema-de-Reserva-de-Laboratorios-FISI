package fisi.reservalabs.capa_negocio.mapper;

import fisi.reservalabs.capa_datos.model.Empleado;
import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;

public class EmpleadoMapper {

    public static EmpleadoDTO toDTO(Empleado entity) {
        if (entity == null) return null;

        EmpleadoDTO dto = new EmpleadoDTO();
        dto.setIdEmpleado(entity.getIdEmpleado());
        dto.setNombreCompleto(entity.getNombreCompleto());
        dto.setCorreo(entity.getCorreo());
        dto.setUsuarioLogin(entity.getUsuarioLogin());
        dto.setCargo(entity.getCargo());

        dto.setContrasena(entity.getContrasena()); // encriptada
        dto.setTextoContra(null);

        return dto;
    }

    public static Empleado toEntity(EmpleadoDTO dto) {
        if (dto == null) return null;

        Empleado entity = new Empleado();
        entity.setIdEmpleado(dto.getIdEmpleado());
        entity.setNombreCompleto(dto.getNombreCompleto());
        entity.setCorreo(dto.getCorreo());
        entity.setUsuarioLogin(dto.getUsuarioLogin());
        entity.setCargo(dto.getCargo());

        entity.setContrasena(dto.getContrasena()); // encriptada

        return entity;
    }
}
