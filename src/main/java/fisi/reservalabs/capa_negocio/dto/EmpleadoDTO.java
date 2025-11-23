package fisi.reservalabs.capa_negocio.dto;

import lombok.Data;

@Data
public class EmpleadoDTO {

    private String idEmpleado;
    private String nombreCompleto;
    private String correo;
    private String usuarioLogin;

    
    private String contrasena;

    
    private String textoContra;

    private String cargo;
}
