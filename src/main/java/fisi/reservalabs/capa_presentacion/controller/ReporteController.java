package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.IReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private IReporteService reporteService;

    @GetMapping
    public List<ReporteDTO> listarReportes() {
        return reporteService.listarReportes();
    }

    @GetMapping("/{id}")
    public ReporteDTO obtenerReporte(@PathVariable String id) {
        return reporteService.obtenerPorId(id);
    }

    @PostMapping
    public ReporteDTO crearReporte(@RequestBody ReporteDTO dto) {
        return reporteService.crearReporte(dto);
    }

    @PutMapping("/{id}")
    public ReporteDTO actualizarReporte(@PathVariable String id, @RequestBody ReporteDTO dto) {
        return reporteService.actualizarReporte(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarReporte(@PathVariable String id) {
        reporteService.eliminarReporte(id);
    }
}
