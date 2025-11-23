package fisi.reservalabs.capa_datos.repository;

import fisi.reservalabs.capa_datos.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

    // Buscar usuario por nombre de usuario (campo 'usuario')
    Optional<Usuario> findByUsuario(String usuario);
}
