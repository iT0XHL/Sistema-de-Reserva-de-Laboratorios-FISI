package fisi.reservalabs.capa_negocio.mapper;

import fisi.reservalabs.capa_datos.model.Usuario;
import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;

public class UsuarioMapper {

    public static UsuarioDTO toDTO(Usuario entity) {
        if (entity == null) return null;

        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(entity.getIdUsuario());
        dto.setNombre(entity.getNombre());
        dto.setContrasena(entity.getContrasena());
        dto.setCorreo(entity.getCorreo());
        dto.setTelefono(entity.getTelefono());
        dto.setRol(entity.getRol());
        dto.setUsuario(entity.getUsuario());
        return dto;
    }

    public static Usuario toEntity(UsuarioDTO dto) {
        if (dto == null) return null;

        Usuario entity = new Usuario();
        entity.setIdUsuario(dto.getIdUsuario());
        entity.setNombre(dto.getNombre());
        entity.setContrasena(dto.getContrasena());
        entity.setCorreo(dto.getCorreo());
        entity.setTelefono(dto.getTelefono());
        entity.setRol(dto.getRol());
        entity.setUsuario(dto.getUsuario());
        return entity;
    }
}
