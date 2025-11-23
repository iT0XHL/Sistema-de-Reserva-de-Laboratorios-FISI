package fisi.reservalabs.capa_datos.model;


import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Laboratorio")
public class Laboratorio {

    @Id
    @Column(name = "idLaboratorio")
    private String idLaboratorio;

    @Column(name = "nombreLab", nullable = false)
    private String nombreLab;

    @Column(name = "capacidad", nullable = false)
    private String capacidad;

    @Column(name = "estado", nullable = false)
    private String estado;

    @Column(name = "especificaciones", columnDefinition = "json")
    private String especificaciones;
}
