package fisi.reservalabs.capa_negocio.dto;

import lombok.Data;

@Data
public class LaboratorioDTO {
    private String idLaboratorio;
    private String nombreLab;
    private String capacidad;
    private String estado;
    private String especificaciones; 
}
