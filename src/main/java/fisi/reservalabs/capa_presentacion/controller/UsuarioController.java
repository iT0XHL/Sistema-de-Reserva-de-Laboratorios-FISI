package fisi.reservalabs.capa_presentacion.controller;

import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_negocio.service.interfaces.IUsuarioService;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private IUsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioDTO usuarioDTO,
                                   HttpSession session) {
        try {
            // validar usuario en servicio
            UsuarioDTO u = usuarioService.login(
                    usuarioDTO.getUsuario(),
                    usuarioDTO.getTextoContra()
            );

            // guardar el usuario en la sesión
            session.setAttribute("usuario", u);

            return ResponseEntity.ok(u);

        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(401)
                    .body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
