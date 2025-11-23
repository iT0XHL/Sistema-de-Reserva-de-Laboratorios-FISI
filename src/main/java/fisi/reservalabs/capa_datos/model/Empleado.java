package fisi.reservalabs.capa_datos.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Empleado")
public class Empleado {

    @Id
    @Column(name = "idEmpleado")
    private String idEmpleado;

    @Column(name = "nombreCompleto", nullable = false)
    private String nombreCompleto;

    @Column(name = "correo", nullable = false)
    private String correo;

    @Column(name = "usuarioLogin", nullable = false)
    private String usuarioLogin;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "cargo", nullable = false)
    private String cargo;
}
