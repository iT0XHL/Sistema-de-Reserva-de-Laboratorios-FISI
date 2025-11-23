package fisi.reservalabs.capa_negocio.service.interfaces;

import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import java.util.List;

public interface IEmpleadoService {
    EmpleadoDTO crearEmpleado(EmpleadoDTO dto);
    List<EmpleadoDTO> listarEmpleados();
    EmpleadoDTO obtenerPorId(String idEmpleado);
    EmpleadoDTO actualizarEmpleado(String idEmpleado, EmpleadoDTO dto);
    void eliminarEmpleado(String idEmpleado);
    EmpleadoDTO login(String usuarioLogin, String textoContra);
}
