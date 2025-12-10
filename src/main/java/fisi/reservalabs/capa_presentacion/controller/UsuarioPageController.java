package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.IReporteService;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;
import fisi.reservalabs.capa_datos.model.Solicitud;
import fisi.reservalabs.capa_datos.repository.SolicitudRepository;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.Date;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import java.text.ParseException;

import java.util.List;

@Controller
public class UsuarioPageController {

    @Autowired
    private ISolicitudService solicitudService;
    @Autowired
    private SolicitudRepository solicitudRepository;
    @Autowired
private IReporteService reporteService;
    
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
        model.addAttribute("activePage", "reserva");
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
        model.addAttribute("activePage", "reserva2");

        return "Reserva2";
    }

    @GetMapping("/solicitudes")
    public String solicitudes(HttpSession session, Model model) {

        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario == null) return "redirect:/loginUsuario";

        model.addAttribute("nombre", usuario.getNombre());
        model.addAttribute("activePage", "solicitudes");
        return "Solicitudes";
    }

    @GetMapping("/reservas")
    public String misReservas(HttpSession session, Model model) {
        
        UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
        if (usuario == null) {
            return "redirect:/loginUsuario";
        }

        model.addAttribute("nombre", usuario.getNombre());
        
        model.addAttribute("activePage", "reservas");

        return "Reservas"; 
    }

    @GetMapping("/perfil")
public String perfilUsuario(HttpSession session, Model model) {
    UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
    if (usuario == null) return "redirect:/loginUsuario";

    model.addAttribute("nombre", usuario.getNombre());
    model.addAttribute("usuario", usuario.getUsuario());
    model.addAttribute("correo", usuario.getCorreo());
    model.addAttribute("rol", "Estudiante");     // 👈 NUEVO
    model.addAttribute("activePage", "perfil");

    return "Perfil"; // tu Perfil.html
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

@GetMapping("/misolicitud/reporte")
public String verReporteSolicitudUsuario(
        @RequestParam("id") String idSolicitud,
        @RequestParam("fecha") String fechaSolicitudStr,
        Model model,
        HttpSession session
) {
    try {
        // ===== 1) Validar sesión de USUARIO =====
        UsuarioDTO usuarioDTO = (UsuarioDTO) session.getAttribute("usuario");
        if (usuarioDTO == null) {
            return "redirect:/loginUsuario";
        }

        String rol    = "Usuario";
        String nombre = usuarioDTO.getNombre();

        model.addAttribute("rol", rol);
        model.addAttribute("nombre", nombre);

        // ===== 2) Parsear fecha (ISO con posible espacio) =====
        fechaSolicitudStr = fechaSolicitudStr.replace(" ", "+");
        OffsetDateTime odt      = OffsetDateTime.parse(fechaSolicitudStr);
        Date          fechaSol  = Date.from(odt.toInstant());

        // ===== 3) Buscar solicitud y reporte =====
        SolicitudDTO solicitud = solicitudService.obtenerPorId(idSolicitud, fechaSol);
        ReporteDTO   reporte   = reporteService.obtenerPorSolicitud(idSolicitud, fechaSol);

        // ===== 4) Enviar datos a la vista =====
        model.addAttribute("solicitud", solicitud);
        model.addAttribute("reporte", reporte);
        // NO ponemos usuarioNombre, porque en el HTML solo se usa si rol == 'Gestor'

        return "Reporte";  // mismo template

    } catch (Exception e) {
        e.printStackTrace();
        return "redirect:/solicitudes";
    }
}

@GetMapping("/solicitudes/reasignar")
public String mostrarPantallaReasignar(
        @RequestParam("id") String id,
        @RequestParam("fecha") String fechaStr,
        HttpSession session,
        Model model) {

    UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
    if (usuario == null) {
        return "redirect:/loginUsuario";
    }

    try {
        // 1) Parsear fechaSolicitud desde el String
        Date fechaSolicitud;

        try {
            // Caso ISO: 2024-11-19T10:20:00.000+00:00
            OffsetDateTime odt = OffsetDateTime.parse(fechaStr);
            fechaSolicitud = Date.from(odt.toInstant());
        } catch (DateTimeParseException ex) {
            // Caso antiguo: "yyyy-MM-dd HH:mm:ss.S"
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
            fechaSolicitud = sdf.parse(fechaStr);
        }

        // 2) ID compuesto
        SolicitudId pk = new SolicitudId(id, fechaSolicitud);

        // 3) Buscar la solicitud en la BD
        Solicitud solicitud = solicitudRepository.findById(pk)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

        // 4) Fecha original de la reserva (la que se quiere cambiar)
        LocalDate fechaOriginal = null;
        if (solicitud.getFechaReserva() != null) {
            fechaOriginal = solicitud.getFechaReserva().toInstant()
                    .atZone(ZoneId.of("America/Lima"))
                    .toLocalDate();
        }

        // 5) Atributos para la vista
        model.addAttribute("solicitud", solicitud);     // 👈 para el breadcrumb
        model.addAttribute("nombre", usuario.getNombre());
        model.addAttribute("idSolicitud", solicitud.getIdSolicitud());
        model.addAttribute("fechaOriginal", fechaOriginal);

        // 6) Nombre del template Thymeleaf
        return "SoliReasignar";   // templates/SoliReasignar.html

    } catch (ParseException e) {
        throw new RuntimeException("Error al procesar la fecha: " + fechaStr, e);
    }
}

@GetMapping("/solicitudes/reasignar2")
public String mostrarSoliReasignar2(
        @RequestParam("id") String idSolicitud,
        @RequestParam("fecha") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate nuevaFecha,
        HttpSession session,
        Model model) {

    UsuarioDTO usuario = (UsuarioDTO) session.getAttribute("usuario");
    if (usuario == null) {
        return "redirect:/loginUsuario";
    }

    // 1) Buscar la solicitud original solo con idSolicitud
    //    (tomamos la más reciente según fechaSolicitud)
    Solicitud solicitud = solicitudRepository
            .findTopByIdSolicitudOrderByFechaSolicitudDesc(idSolicitud)
            .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));

    // 2) Atributos para la vista
    model.addAttribute("nombre", usuario.getNombre());
    model.addAttribute("idSolicitud", idSolicitud);
    model.addAttribute("nuevaFecha", nuevaFecha);
    model.addAttribute("solicitud", solicitud);   // 👈 para el breadcrumb

    // 3) Nombre del template Thymeleaf
    return "SoliReasignar2";  // templates/SoliReasignar2.html
}

}