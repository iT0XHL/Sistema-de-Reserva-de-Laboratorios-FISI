package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import java.util.List;

public interface IUsuarioService {
    UsuarioDTO crearUsuario(UsuarioDTO dto);
    List<UsuarioDTO> listarUsuarios();
    UsuarioDTO obtenerPorId(String idUsuario);
    UsuarioDTO actualizarUsuario(String idUsuario, UsuarioDTO dto);
    void eliminarUsuario(String idUsuario);
    UsuarioDTO login(String usuario, String contrasena);
    UsuarioDTO registrarUsuario(UsuarioDTO usuarioDTO);
}
