package fisi.reservalabs.capa_negocio.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class LaboratorioDTO {

    private String idLaboratorio;
    private String nombreLab;
    private String capacidad;
    private String estado;
    private String especificaciones;

    private Integer equipos;
    private List<String> software;

    public void procesarEspecificaciones() {

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(especificaciones);

            this.equipos = json.has("equipos") ? json.get("equipos").asInt() : null;

            this.software = new ArrayList<>();
            if (json.has("software")) {
                json.get("software").forEach(item -> software.add(item.asText()));
            }

        } catch (Exception e) {
            this.equipos = null;
            this.software = new ArrayList<>();
        }
    }
}
