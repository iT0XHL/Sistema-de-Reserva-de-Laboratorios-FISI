package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_datos.model.SolicitudId;
import fisi.reservalabs.capa_datos.repository.UsuarioRepository;
import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.dto.LaboratorioDTO;
import fisi.reservalabs.capa_negocio.dto.ReporteDTO;
import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ILaboratorioService;
import fisi.reservalabs.capa_negocio.service.interfaces.IReporteService;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.time.OffsetDateTime;
import java.util.Date;
import java.util.List;

@Controller
public class GestorPageController {

    @Autowired
    private ISolicitudService solicitudService;

    @Autowired
    private ILaboratorioService laboratorioService;

    @Autowired
private UsuarioRepository usuarioRepository;
    @Autowired
    private IReporteService reporteService;

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
        model.addAttribute("seccionActual", "principal");
         return "PrincipalGestor";
    }

    @GetMapping("/pendientes")
public String listarPendientesGestor(HttpSession session, Model model) {

    EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
    if (empleado == null) {
        return "redirect:/loginGestor";
    }

    model.addAttribute("nombreGestor", empleado.getNombreCompleto());

    // Esto ya ni siquiera es obligatorio para la pantalla, porque el JS usa fetch.
    // Lo puedes dejar o quitar, no afecta el listado.
    // List<SolicitudDTO> pendientes = solicitudService.listarSolicitudesPendientes();
    // model.addAttribute("solicitudesPendientes", pendientes);

    return "Pendientes"; // nombre de tu template
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
        model.addAttribute("seccionActual", "solicitudes");
        return "Reasignacion"; // Reasignacion.html
    }

    @GetMapping("/laboratorio")
    public String laboratorioPage(HttpSession session, Model model) {
        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");

        if (empleado == null)
            return "redirect:/loginGestor";

        model.addAttribute("nombreGestor", empleado.getNombreCompleto());
        model.addAttribute("correoGestor", empleado.getCorreo());
        model.addAttribute("seccionActual", "laboratorio");
        return "Laboratorio";  // Laboratorio.html
    }
    
    @GetMapping("/solicitud/reporte")
public String verReporteSolicitudGestor(
        @RequestParam("id") String idSolicitud,
        @RequestParam("fecha") String fechaSolicitudStr,
        Model model,
        HttpSession session
) {
    try {
        // ===== 1) Validar sesión de GESTOR =====
        EmpleadoDTO empleadoDTO = (EmpleadoDTO) session.getAttribute("empleado");
        if (empleadoDTO == null) {
            return "redirect:/loginGestor";
        }

        String rol    = "Gestor";
        String nombre = empleadoDTO.getNombreCompleto();

        model.addAttribute("rol", rol);
        model.addAttribute("nombre", nombre);

        // ===== 2) Parsear fecha (formato ISO con posible espacio por el +) =====
        fechaSolicitudStr = fechaSolicitudStr.replace(" ", "+");
        OffsetDateTime odt      = OffsetDateTime.parse(fechaSolicitudStr);
        Date          fechaSol  = Date.from(odt.toInstant());

        // ===== 3) Buscar solicitud y reporte =====
        SolicitudDTO solicitud = solicitudService.obtenerPorId(idSolicitud, fechaSol);
        ReporteDTO   reporte   = reporteService.obtenerPorSolicitud(idSolicitud, fechaSol);

        // ===== 4) Nombre del usuario solicitante (solo gestor lo ve) =====
        String usuarioNombre = usuarioRepository.findById(solicitud.getIdUsuario())
                .map(u -> u.getNombre())  // o getNombreCompleto()
                .orElse("Usuario " + solicitud.getIdUsuario());

        // ===== 5) Enviar datos a la vista =====
        model.addAttribute("solicitud", solicitud);
        model.addAttribute("reporte", reporte);
        model.addAttribute("usuarioNombre", usuarioNombre);

        return "Reporte";  // templates/Reporte.html

    } catch (Exception e) {
        e.printStackTrace();
        return "redirect:/historial";
    }
}


    @GetMapping("/solicitud/detalle")
    public String detalleSolicitudGestor(
            @RequestParam("id") String id,
            @RequestParam("fecha") String fechaStr,
            HttpSession session,
            Model model) {

        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
        if (empleado == null) return "redirect:/loginGestor";

        try {
            fechaStr = fechaStr.replace(" ", "+");

            OffsetDateTime odt = OffsetDateTime.parse(fechaStr);
            Date fecha = Date.from(odt.toInstant());

            SolicitudDTO solicitud = solicitudService.obtenerPorId(id, fecha);

            model.addAttribute("solicitud", solicitud);
            model.addAttribute("nombreGestor", empleado.getNombreCompleto());
            model.addAttribute("correoGestor", empleado.getCorreo());

            return "Detalle";

        } catch (Exception ex) {
            throw new RuntimeException("Error al procesar la fecha: " + fechaStr);
        }
    }   

    @GetMapping("/historial")
public String verHistorial(HttpSession session, Model model) {

    EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
    if (empleado == null) {
        return "redirect:/loginGestor";
    }

    model.addAttribute("nombreGestor", empleado.getNombreCompleto());

    // El listado lo cargará el JS vía fetch
    return "Historial";   // nombre de tu template (el de la captura)
}


    @PostMapping("/solicitudes/rechazar")
@ResponseBody
public ResponseEntity<Void> rechazarSolicitud(
        @RequestParam String idSolicitud,
        @RequestParam("fechaSolicitud") String fechaSolicitudStr,
        @RequestParam String motivo,
        HttpSession session
) {
    try {
        // 1) Empleado logueado
        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
        if (empleado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2) Parsear fechaSolicitud
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        Date fechaSolicitud = sdf.parse(fechaSolicitudStr);

        // 3) ID compuesto
        SolicitudId solicitudId = new SolicitudId(idSolicitud, fechaSolicitud);

        // 4) Llamar al service con motivo + empleado
        solicitudService.rechazarSolicitud(solicitudId, motivo, empleado);

        return ResponseEntity.ok().build();

    } catch (Exception ex) {
        ex.printStackTrace();
        return ResponseEntity.badRequest().build();
    }
}

@PostMapping("/solicitudes/aceptar")
@ResponseBody
public ResponseEntity<Void> aceptarSolicitud(
        @RequestParam String idSolicitud,
        @RequestParam String fechaSolicitud,
        HttpSession session
) {

    try {
        // 1) Empleado logueado
        EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
        if (empleado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2) Parsear fechaSolicitud
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.S");
        Date fecha = sdf.parse(fechaSolicitud);

        // 3) ID compuesto
        SolicitudId id = new SolicitudId(idSolicitud, fecha);

        // 4) Llamar al service pasando el empleado
        solicitudService.aceptarSolicitud(id, empleado);

        return ResponseEntity.ok().build();

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}

    @GetMapping("/estado/aceptadas")
    @ResponseBody
    public List<SolicitudDTO> listarAceptadas() {
        return solicitudService.listarSolicitudesAceptadas();
    }

    @GetMapping("/aceptadas-sin-laboratorio")
    @ResponseBody
    public List<SolicitudDTO> listarAceptadasSinLab() {
        return solicitudService.listarSolicitudesAceptadasSinLaboratorio();
    }

    @GetMapping("/aceptadas-con-laboratorio")
    @ResponseBody
    public List<SolicitudDTO> listarAceptadasConLaboratorio() {
        return solicitudService.listarSolicitudesAceptadasConLaboratorio();
    }

    @GetMapping("/laboratorio/asignacion")
public String laboratorioDetalle(
        @RequestParam("id") String id,
        @RequestParam("fecha") String fechaStr,
        HttpSession session,
        Model model) {

    EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
    if (empleado == null) return "redirect:/loginGestor";

    // La fecha llega como ISO: 2024-11-19T10:20:00.000+00:00
    fechaStr = fechaStr.replace(" ", "+");
    OffsetDateTime odt = OffsetDateTime.parse(fechaStr);
    Date fechaSolicitud = Date.from(odt.toInstant());

    SolicitudDTO solicitud = solicitudService.obtenerPorId(id, fechaSolicitud);

    // Siempre calculamos un nombre amigable
    String usuarioNombre = usuarioRepository.findById(solicitud.getIdUsuario())
            .map(u -> u.getNombre())   // o getNombreCompleto(), según tu entidad
            .orElse("Usuario " + solicitud.getIdUsuario());

    List<LaboratorioDTO> labsDisponibles = laboratorioService.listarLaboratoriosDisponibles();

    model.addAttribute("solicitud", solicitud);
    model.addAttribute("labsDisponibles", labsDisponibles);
    model.addAttribute("nombreGestor", empleado.getNombreCompleto());
    model.addAttribute("usuarioNombre", usuarioNombre);   // <- importante

    return "Asignacion";
}

@PostMapping("/laboratorio/asignacion/confirmar")
@ResponseBody
public ResponseEntity<Void> confirmarAsignacion(
        @RequestParam("id") String idSolicitud,
        @RequestParam("fecha") String fechaStr,
        @RequestParam("lab") String idLaboratorio,
        HttpSession session) {

    EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
    if (empleado == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    try {
        // misma lógica que en el GET
        fechaStr = fechaStr.replace(" ", "+");
        OffsetDateTime odt = OffsetDateTime.parse(fechaStr);
        Date fechaSolicitud = Date.from(odt.toInstant());

        solicitudService.asignarLaboratorioAGestor(
                idSolicitud,
                fechaSolicitud,
                idLaboratorio,
                empleado
        );

        return ResponseEntity.ok().build();

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}


    @GetMapping("/gestor/perfil")
public String perfilGestor(HttpSession session, Model model) {

    EmpleadoDTO empleado = (EmpleadoDTO) session.getAttribute("empleado");
    if (empleado == null) return "redirect:/loginGestor";

    model.addAttribute("nombre", empleado.getNombreCompleto());
    model.addAttribute("usuario", empleado.getUsuarioLogin());
    model.addAttribute("correo", empleado.getCorreo());
    model.addAttribute("rol", "Gestor");         // 👈 AQUÍ MARCAMOS QUE ES GESTOR

    model.addAttribute("seccionActual", "gestor/perfil");

    return "Perfil"; // usamos el MISMO Perfil.html
}


}
