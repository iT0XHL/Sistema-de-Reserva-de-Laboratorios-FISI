package fisi.reservalabs.capa_datos.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import fisi.reservalabs.capa_datos.model.Empleado;


public interface EmpleadoRepository extends JpaRepository<Empleado, String> {

    // Buscar usuario por nombre de usuario (campo 'usuario')
    Optional<Empleado> findByUsuarioLogin(String usuarioLogin);

}
