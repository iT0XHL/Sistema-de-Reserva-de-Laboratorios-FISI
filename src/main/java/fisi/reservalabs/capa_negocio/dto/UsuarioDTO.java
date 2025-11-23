package fisi.reservalabs.capa_negocio.dto;

import lombok.Data;

@Data
public class UsuarioDTO {
    private String idUsuario;
    private String nombre;
    private String contrasena;   // Encriptada
    private String textoContra;  // Texto plano (frontend)
    private String correo;
    private String telefono;
    private String rol;
    private String usuario;      // Nombre de usuario para login
}
