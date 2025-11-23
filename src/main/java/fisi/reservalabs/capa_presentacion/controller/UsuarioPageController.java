package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class UsuarioPageController {

    @Autowired
    private ISolicitudService solicitudService;

    @GetMapping("/loginUsuario")
    public String loginUsuarioPage() {
        return "loginUsuario";
    }

    @GetMapping("/principalUsuario")
    public String principalUsuario(HttpSession session, Model model) {

        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");

        if (usuario == null) {
            return "redirect:/loginUsuario";
        }

        model.addAttribute("nombre", usuario.getNombre());
        model.addAttribute("usuario", usuario.getUsuario());
        model.addAttribute("correo", usuario.getCorreo());

        System.out.println("ID USUARIO LOGUEADO = " + usuario.getIdUsuario());

        List<SolicitudDTO> solicitudes =
                solicitudService.listarSolicitudesPorUsuario(usuario.getIdUsuario());

        model.addAttribute("solicitudes", solicitudes);

        return "principalUsuario";
    }

    @GetMapping("/reserva")
    public String reserva(HttpSession session, Model model) {

        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/loginUsuario";

        model.addAttribute("nombre", usuario.getNombre());
        return "Reserva";
    }

    @GetMapping("/reserva2/{fecha}")
    public String reserva2ConFecha(
            @PathVariable("fecha") String fecha,
            HttpSession session,
            Model model) {

        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/loginUsuario";

        model.addAttribute("nombre", usuario.getNombre());
        model.addAttribute("fechaReserva", fecha);

        return "Reserva2";
    }

    @GetMapping("/solicitudes")
    public String solicitudes(HttpSession session, Model model) {

        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/loginUsuario";

        model.addAttribute("nombre", usuario.getNombre());
        return "Solicitudes";
    }
}
