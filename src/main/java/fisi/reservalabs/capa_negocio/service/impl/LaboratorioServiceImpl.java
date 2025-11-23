package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Laboratorio;
import fisi.reservalabs.capa_datos.repository.LaboratorioRepository;
import fisi.reservalabs.capa_negocio.dto.LaboratorioDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.LaboratorioMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.ILaboratorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LaboratorioServiceImpl implements ILaboratorioService {

    @Autowired
    private LaboratorioRepository laboratorioRepository;

    @Override
    public LaboratorioDTO crearLaboratorio(LaboratorioDTO dto) {
        Laboratorio laboratorio = LaboratorioMapper.toEntity(dto);
        laboratorio = laboratorioRepository.save(laboratorio);
        return LaboratorioMapper.toDTO(laboratorio);
    }

    @Override
    public List<LaboratorioDTO> listarLaboratorios() {
        return laboratorioRepository.findAll()
                .stream()
                .map(LaboratorioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LaboratorioDTO obtenerPorId(String idLaboratorio) {
        Laboratorio laboratorio = laboratorioRepository.findById(idLaboratorio)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado"));
        return LaboratorioMapper.toDTO(laboratorio);
    }

    @Override
    public LaboratorioDTO actualizarLaboratorio(String idLaboratorio, LaboratorioDTO dto) {
        Laboratorio laboratorio = laboratorioRepository.findById(idLaboratorio)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado"));

        laboratorio.setNombreLab(dto.getNombreLab());
        laboratorio.setCapacidad(dto.getCapacidad());
        laboratorio.setEstado(dto.getEstado());
        laboratorio.setEspecificaciones(dto.getEspecificaciones());

        laboratorio = laboratorioRepository.save(laboratorio);
        return LaboratorioMapper.toDTO(laboratorio);
    }

    @Override
    public void eliminarLaboratorio(String idLaboratorio) {
        Laboratorio laboratorio = laboratorioRepository.findById(idLaboratorio)
                .orElseThrow(() -> new ResourceNotFoundException("Laboratorio no encontrado"));
        laboratorioRepository.delete(laboratorio);
    }
}
