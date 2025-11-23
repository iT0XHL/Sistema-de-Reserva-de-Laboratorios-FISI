package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_negocio.dto.LaboratorioDTO;
import java.util.List;

public interface ILaboratorioService {
    LaboratorioDTO crearLaboratorio(LaboratorioDTO dto);
    List<LaboratorioDTO> listarLaboratorios();
    LaboratorioDTO obtenerPorId(String idLaboratorio);
    LaboratorioDTO actualizarLaboratorio(String idLaboratorio, LaboratorioDTO dto);
    void eliminarLaboratorio(String idLaboratorio);
    
}
