package fisi.reservalabs.capa_datos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, SolicitudId> {

    @Query("SELECT s FROM Solicitud s WHERE s.usuario.idUsuario = :idUsuario")
    List<Solicitud> findByUsuario(String idUsuario);

    // CORRECTO para buscar solicitudes por empleado y estado
    List<Solicitud> findByEmpleado_IdEmpleadoAndEstado(String idEmpleado, String estado);

    List<Solicitud> findByEmpleado_IdEmpleadoAndTipo(String idEmpleado, String tipo);
    List<Solicitud> findByEmpleado_IdEmpleadoAndEstadoAndLaboratorioIsNull(String idEmpleado, String estado);

    @Query("SELECT s.idSolicitud FROM Solicitud s ORDER BY s.idSolicitud DESC")
    List<String> getLastId();
}

