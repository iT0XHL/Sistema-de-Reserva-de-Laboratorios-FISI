package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    @Autowired
    private ISolicitudService solicitudService;

    @GetMapping("/mis-solicitudes")
    public List<SolicitudDTO> listarSolicitudes(HttpSession session) {

        var usuario = session.getAttribute("usuario");

        if (usuario == null) return List.of();

        String idUsuario = ((fisi.reservalabs.capa_negocio.dto.UsuarioDTO) usuario).getIdUsuario();

        return solicitudService.listarSolicitudesPorUsuario(idUsuario);
    }

    @GetMapping("/reasignacion")
        public List<SolicitudDTO> listarSolicitudesPorReasignacion(HttpSession session) {

            var empleado = session.getAttribute("empleado");

            if (empleado == null) return List.of();

            String idEmpleado = ((EmpleadoDTO) empleado).getIdEmpleado();

            return solicitudService.listarSolicitudesPorEmpleadoYTipo(idEmpleado, "REASIGNACION");
    }

    @GetMapping("/pendiente-laboratorio")
    public List<SolicitudDTO> listarSolicitudesPendientesSinLaboratorio(HttpSession session) {

        var empleado = session.getAttribute("empleado");

        if (empleado == null) return List.of();

        String idEmpleado = ((EmpleadoDTO) empleado).getIdEmpleado();

        // 👉 Nuevo método del servicio
         return solicitudService.listarSolicitudesPendientesSinLaboratorio(idEmpleado);
    }



}
