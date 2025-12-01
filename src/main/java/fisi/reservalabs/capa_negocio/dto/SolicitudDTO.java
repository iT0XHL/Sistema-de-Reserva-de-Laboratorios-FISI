package fisi.reservalabs.capa_negocio.dto;

import lombok.*;
import java.util.Date;

import fisi.reservalabs.capa_datos.model.Solicitud;

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

    public SolicitudDTO(Solicitud solicitud) {
        this.idSolicitud = solicitud.getIdSolicitud();
        this.fechaSolicitud = solicitud.getFechaSolicitud();
        this.idUsuario = solicitud.getUsuario().getIdUsuario();  // Si Usuario está mapeado en la entidad
        this.idLaboratorio = (solicitud.getLaboratorio() != null) ? solicitud.getLaboratorio().getIdLaboratorio() : null;
        this.idEmpleado = (solicitud.getEmpleado() != null) ? solicitud.getEmpleado().getIdEmpleado() : null;
        this.estado = solicitud.getEstado();
        this.fechaReserva = solicitud.getFechaReserva();
        this.horaInicio = solicitud.getHoraInicio();
        this.horaFin = solicitud.getHoraFin();
        this.motivo = solicitud.getMotivo();
        this.tipo = solicitud.getTipo();
    }
}
