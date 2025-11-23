package fisi.reservalabs.capa_datos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import fisi.reservalabs.capa_datos.model.Laboratorio;

public interface LaboratorioRepository extends JpaRepository<Laboratorio, String> {

}
