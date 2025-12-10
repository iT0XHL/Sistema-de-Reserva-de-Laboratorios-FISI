package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.SolicitudDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.ISolicitudService;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    
    @PostMapping("/crear")
    public ResponseEntity<SolicitudDTO> crearSolicitud(@RequestBody SolicitudDTO solicitudDTO, HttpSession session) {
        // Llamar al servicio pasando tanto el DTO como la sesión
        SolicitudDTO solicitudCreada = solicitudService.crearSolicitud(solicitudDTO, session);
        
        return ResponseEntity.ok(solicitudCreada);  // Devolver la solicitud creada como respuesta
    }

        @PutMapping("/reasignar")
    public ResponseEntity<SolicitudDTO> reasignarSolicitud(
            @RequestBody SolicitudReasignarDTO body,
            HttpSession session) {

        // Verificar usuario logueado
        var usuarioSesion = session.getAttribute("usuario");
        if (usuarioSesion == null) {
            // 401 si alguien intenta llamar sin sesión
            return ResponseEntity.status(401).build();
        }

        // Aquí llamas al servicio para ACTUALIZAR la solicitud
        // → debes implementar este método en ISolicitudService y su implementación
        SolicitudDTO actualizada = solicitudService.reasignarSolicitud(
                body.getIdSolicitud(),
                body.getFechaReserva(),
                body.getHoraInicio(),
                body.getHoraFin(),
                body.getRequerimientos()        );

        return ResponseEntity.ok(actualizada);
    }


    @GetMapping("/pendientes")
    public List<SolicitudDTO> listarPendientesApi() {
        List<SolicitudDTO> lista = solicitudService.listarSolicitudesPendientes();

        // DEBUG: ver qué está saliendo realmente
        System.out.println(">>> /api/solicitudes/pendientes devuelve: " + lista.size());
        lista.forEach(s ->
            System.out.println("   - " + s.getIdSolicitud() + " / " + s.getEstado())
        );

        return lista;
    }
@GetMapping("/historial")
    public List<SolicitudDTO> listarHistorial() {
        return solicitudService.listarHistorialSolicitudes();
    }


    // Todas las solicitudes ACEPTADAS (cualquier tipo)
    @GetMapping("/aceptadas")
    public List<SolicitudDTO> listarSolicitudesAceptadas() {
        return solicitudService.listarSolicitudesAceptadas();
    }

    // ACEPTADAS y tipo = ASIGNACION
    @GetMapping("/aceptadas/asignacion")
    public List<SolicitudDTO> listarSolicitudesAceptadasAsignacion() {
        return solicitudService.listarSolicitudesAceptadasPorTipo("ASIGNACION");
    }

    // ACEPTADAS y tipo = REASIGNACION
    @GetMapping("/aceptadas/reasignacion")
    public List<SolicitudDTO> listarSolicitudesAceptadasReasignacion() {
        return solicitudService.listarSolicitudesAceptadasPorTipo("REASIGNACION");
    }

    @GetMapping("/rechazadas")
    public List<SolicitudDTO> listarSolicitudesRechazadas() {
        return solicitudService.listarSolicitudesRechazadas();
    }

    public static class SolicitudReasignarDTO {
        private String idSolicitud;
        private String fechaReserva;       // "yyyy-MM-dd"
        private String horaInicio;         // "1970-01-01T08:00:00Z" desde JS
        private String horaFin;            // igual
        private Integer cantidadLaboratorios;
        private String requerimientos;     // JSON de array ["Python","MySQL"]

        public String getIdSolicitud() { return idSolicitud; }
        public void setIdSolicitud(String idSolicitud) { this.idSolicitud = idSolicitud; }

        public String getFechaReserva() { return fechaReserva; }
        public void setFechaReserva(String fechaReserva) { this.fechaReserva = fechaReserva; }

        public String getHoraInicio() { return horaInicio; }
        public void setHoraInicio(String horaInicio) { this.horaInicio = horaInicio; }

        public String getHoraFin() { return horaFin; }
        public void setHoraFin(String horaFin) { this.horaFin = horaFin; }

        public Integer getCantidadLaboratorios() { return cantidadLaboratorios; }
        public void setCantidadLaboratorios(Integer cantidadLaboratorios) { this.cantidadLaboratorios = cantidadLaboratorios; }

        public String getRequerimientos() { return requerimientos; }
        public void setRequerimientos(String requerimientos) { this.requerimientos = requerimientos; }
    }
}
