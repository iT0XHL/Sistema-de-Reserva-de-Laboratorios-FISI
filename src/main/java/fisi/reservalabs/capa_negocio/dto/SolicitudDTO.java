package fisi.reservalabs.capa_negocio.dto;

import lombok.*;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudDTO {

    private String idSolicitud;
    private Date fechaSolicitud;

    private String idUsuario;
    private String idLaboratorio;
    private String idEmpleado;

    private String estado;
    private Date fechaReserva;
    private Date horaInicio;
    private Date horaFin;
    private String motivo;
    private String tipo;
}
