package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Empleado;
import fisi.reservalabs.capa_datos.repository.EmpleadoRepository;
import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.EmpleadoMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.IEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmpleadoServiceImpl implements IEmpleadoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public EmpleadoDTO crearEmpleado(EmpleadoDTO dto) {
        Empleado empleado = EmpleadoMapper.toEntity(dto);
        empleado = empleadoRepository.save(empleado);
        return EmpleadoMapper.toDTO(empleado);
    }


    @Override
    public EmpleadoDTO login(String usuarioLogin, String contrasena) {
        Empleado empleado = empleadoRepository.findByUsuarioLogin(usuarioLogin)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        if (!passwordEncoder.matches(contrasena, empleado.getContrasena())) {
            throw new ResourceNotFoundException("Contraseña incorrecta");
        }

        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public List<EmpleadoDTO> listarEmpleados() {
        return empleadoRepository.findAll().stream()
                .map(EmpleadoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmpleadoDTO obtenerPorId(String idEmpleado) {
        Empleado empleado = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public EmpleadoDTO actualizarEmpleado(String idEmpleado, EmpleadoDTO dto) {
        Empleado empleado = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        empleado.setNombreCompleto(dto.getNombreCompleto());
        empleado.setCorreo(dto.getCorreo());
        empleado.setUsuarioLogin(dto.getUsuarioLogin());
        empleado.setContrasena(dto.getContrasena());
        empleado.setCargo(dto.getCargo());

        empleado = empleadoRepository.save(empleado);
        return EmpleadoMapper.toDTO(empleado);
    }

    @Override
    public void eliminarEmpleado(String idEmpleado) {
        Empleado empleado = empleadoRepository.findById(idEmpleado)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));
        empleadoRepository.delete(empleado);
    }
}
