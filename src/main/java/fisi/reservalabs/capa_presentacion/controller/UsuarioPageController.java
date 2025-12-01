package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;

import java.time.OffsetDateTime;
import java.util.Date;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class UsuarioPageController {

    @Autowired
    private ISolicitudService solicitudService;
    @Autowired
    private SolicitudRepository solicitudRepository;
    
    @GetMapping("/loginUsuario")
    public String loginUsuarioPage() {
        return "LoginUsuario";
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
        model.addAttribute("activePage", "principal");

        return "PrincipalUsuario";
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

    @GetMapping("/solicitudes/detalle")
public String detalleSolicitud(
        @RequestParam("id") String id,
        @RequestParam("fecha") String fechaStr,
        Model model,
        HttpSession session) {
            UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/loginUsuario";
    try {
        // Corrige el formato incorrecto: cambia " 00:00" → "+00:00"
        fechaStr = fechaStr.replace(" ", "+");

        // Convertimos la fecha
        OffsetDateTime odt = OffsetDateTime.parse(fechaStr);
        Date fechaConvertida = Date.from(odt.toInstant());

        // Crear ID compuesto
        SolicitudId solicitudId = new SolicitudId(id, fechaConvertida);

        // Buscar solicitud
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        model.addAttribute("solicitud", solicitud);
        model.addAttribute("nombre", usuario.getNombre());

        return "Detalles";
    } catch (Exception ex) {
        throw new RuntimeException("Error al procesar la fecha: " + fechaStr);
    }
}


}