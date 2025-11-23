package fisi.reservalabs.capa_negocio.dto;

import lombok.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReporteDTO {
    private String idReporte;
    private String idEmpleado;   // solo el id del empleado
    private String idSolicitud;  // solo el id de la solicitud
    private Date fechaSolicitud;
    private String descripcion;
    private String tipoReporte;
    private Date fechaEmision;
}
