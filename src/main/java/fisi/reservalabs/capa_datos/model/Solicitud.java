package fisi.reservalabs.capa_datos.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "Solicitud")
@IdClass(SolicitudId.class)
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Solicitud {

    @Id
    @Column(name = "idSolicitud", length = 50)
    private String idSolicitud;

    @Id
    @Column(name = "fechaSolicitud")
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaSolicitud;

    // Relaciones
    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "idLaboratorio", nullable = true)
    private Laboratorio laboratorio;

    @ManyToOne
    @JoinColumn(name = "idEmpleado")
    private Empleado empleado;

    @Column(name = "estado", length = 50, nullable = false)
    private String estado;

    @Column(name = "fechaReserva", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date fechaReserva;

    @Column(name = "horaInicio", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date horaInicio;

    @Column(name = "horaFin", nullable = false)
    @Temporal(TemporalType.TIME)
    private Date horaFin;

    @Column(name = "motivo", length = 255)
    private String motivo;

    @Column(name = "tipo", length = 50)
    private String tipo;
}
