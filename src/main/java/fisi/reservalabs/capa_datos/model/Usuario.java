package fisi.reservalabs.capa_datos.model;   

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Usuario")
public class Usuario {

    @Id
    @Column(name = "idUsuario")
    private String idUsuario;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "usuario", nullable = false)
    private String usuario;

    @Column(name = "contrasena", nullable = false)
    private String contrasena;

    @Column(name = "correo", nullable = false)
    private String correo;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "rol", nullable = false)
    private String rol;
}
