package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.EmpleadoDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.IEmpleadoService;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/empleados")
public class EmpleadoController {

    @Autowired
    private IEmpleadoService empleadoService;

    // ----------------------------
    // LOGIN PARA EMPLEADOS (GESTOR)
    // ----------------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EmpleadoDTO dto,
                                   HttpSession session) {
        try {
            // Validar usuario y contraseña
            EmpleadoDTO empleado = empleadoService.login(
                    dto.getUsuarioLogin(),
                    dto.getTextoContra()
            );

            // Guardar en sesión
            session.setAttribute("empleado", empleado);

            return ResponseEntity.ok(empleado);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(401)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    // ----------------------------
    // CRUD
    // ----------------------------

    @GetMapping
    public List<EmpleadoDTO> listarEmpleados() {
        return empleadoService.listarEmpleados();
    }

    @GetMapping("/{id}")
    public EmpleadoDTO obtenerEmpleado(@PathVariable String id) {
        return empleadoService.obtenerPorId(id);
    }

    @PostMapping
    public EmpleadoDTO crearEmpleado(@RequestBody EmpleadoDTO dto) {
        return empleadoService.crearEmpleado(dto);
    }

    @PutMapping("/{id}")
    public EmpleadoDTO actualizarEmpleado(@PathVariable String id, @RequestBody EmpleadoDTO dto) {
        return empleadoService.actualizarEmpleado(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarEmpleado(@PathVariable String id) {
        empleadoService.eliminarEmpleado(id);
    }
}
