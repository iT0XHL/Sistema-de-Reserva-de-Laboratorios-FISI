package fisi.reservalabs.capa_datos.model;

import java.io.Serializable;
import java.util.Date;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SolicitudId implements Serializable {

    private String idSolicitud;
    private Date fechaSolicitud;
}
