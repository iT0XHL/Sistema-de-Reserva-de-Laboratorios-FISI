package fisi.reservalabs.capa_datos.repository;

import fisi.reservalabs.capa_datos.model.Reporte;
import fisi.reservalabs.capa_datos.model.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReporteRepository extends JpaRepository<Reporte, String> {

    // Un reporte por solicitud rechazada
    Optional<Reporte> findBySolicitud(Solicitud solicitud);
}
