package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.LaboratorioDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ILaboratorioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/laboratorios")
public class LaboratorioController {

    @Autowired
    private ILaboratorioService laboratorioService;

    @GetMapping
    public List<LaboratorioDTO> listarLaboratorios() {
        return laboratorioService.listarLaboratorios();
    }

    @GetMapping("/{id}")
    public LaboratorioDTO obtenerLaboratorio(@PathVariable String id) {
        return laboratorioService.obtenerPorId(id);
    }

    @PostMapping
    public LaboratorioDTO crearLaboratorio(@RequestBody LaboratorioDTO dto) {
        return laboratorioService.crearLaboratorio(dto);
    }

    @PutMapping("/{id}")
    public LaboratorioDTO actualizarLaboratorio(@PathVariable String id, @RequestBody LaboratorioDTO dto) {
        return laboratorioService.actualizarLaboratorio(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarLaboratorio(@PathVariable String id) {
        laboratorioService.eliminarLaboratorio(id);
    }
}
