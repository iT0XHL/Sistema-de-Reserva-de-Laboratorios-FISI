package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class GestorPageController {

    @Autowired
    private ISolicitudService solicitudService;

    @GetMapping("/loginGestor")
    public String loginGestorPage() {
        return "loginGestor"; // LoginGestor.html
    }

    @GetMapping("/principalGestor")
    public String principalGestor(Model model, HttpSession session) {

        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");

        if (empleado == null)
            return "redirect:/loginGestor";

        List<SolicitudDTO> solicitudesPendientes =
                solicitudService.listarSolicitudesPendientesDeEmpleado(empleado.getIdEmpleado());

        model.addAttribute("solicitudes", solicitudesPendientes);
        model.addAttribute("empleado", empleado);
         model.addAttribute("correoGestor", empleado.getCorreo());
         model.addAttribute("nombreGestor", empleado.getNombreCompleto());
        return "PrincipalGestor";
    }

    @GetMapping("/pendientes")
    public String solicitudesPendientes(HttpSession session, Model model) {

        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");

        if (empleado == null)
            return "redirect:/loginGestor";

        List<SolicitudDTO> solicitudesPendientes =
                solicitudService.listarSolicitudesPendientesDeEmpleado(empleado.getIdEmpleado());

        model.addAttribute("solicitudesPendientes", solicitudesPendientes);
        model.addAttribute("nombreGestor", empleado.getNombreCompleto());
        model.addAttribute("correoGestor", empleado.getCorreo());

        return "Pendientes"; // nombre del html
    }


    @GetMapping("/reasignacion")
    public String solicitudesReasignacion(HttpSession session, Model model) {

        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");

        if (empleado == null)
            return "redirect:/loginGestor";

        // 1. Obtener SOLO solicitudes pendientes del empleado
        List<SolicitudDTO> solicitudesPendientes =
                solicitudService.listarSolicitudesPendientesDeEmpleado(empleado.getIdEmpleado());

        // 2. Filtrar SOLO las que sean tipo = "REASIGNACION"
        List<SolicitudDTO> solicitudesReasignacion = solicitudesPendientes.stream()
                .filter(s -> s.getTipo() != null && s.getTipo().equalsIgnoreCase("REASIGNACION"))
                .toList();

        // 3. Mandar datos al HTML
        model.addAttribute("solicitudesReasignacion", solicitudesReasignacion);
        model.addAttribute("nombreGestor", empleado.getNombreCompleto());
        model.addAttribute("correoGestor", empleado.getCorreo());

        return "Reasignacion"; // Reasignacion.html
    }

    @GetMapping("/laboratorio")
    public String laboratorioPage(HttpSession session, Model model) {
        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");

        if (empleado == null)
            return "redirect:/loginGestor";

        model.addAttribute("nombreGestor", empleado.getNombreCompleto());
        model.addAttribute("correoGestor", empleado.getCorreo());

        return "Laboratorio";  // Laboratorio.html
    }

}
