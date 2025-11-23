package fisi.reservalabs.capa_datos.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "Reporte")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reporte {

    @Id
    @Column(length = 50)
    private String idReporte;

    @ManyToOne
    @JoinColumn(name = "idEmpleado", nullable = false)
    private Empleado empleado;

    // Clave compuesta hacia Solcitud
    @ManyToOne
    @JoinColumns({
            @JoinColumn(name = "idSolicitud", referencedColumnName = "idSolicitud"),
            @JoinColumn(name = "fechaSolicitud", referencedColumnName = "fechaSolicitud")
    })
    private Solicitud solicitud;

    @Column(length = 255)
    private String descripcion;

    @Column(length = 50)
    private String tipoReporte;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaEmision;
}
