package fisi.reservalabs.capa_negocio.service.impl;

import fisi.reservalabs.capa_datos.model.Usuario;
import fisi.reservalabs.capa_datos.repository.UsuarioRepository;
import fisi.reservalabs.capa_negocio.dto.UsuarioDTO;
import fisi.reservalabs.capa_negocio.exception.ResourceNotFoundException;
import fisi.reservalabs.capa_negocio.mapper.UsuarioMapper;
import fisi.reservalabs.capa_negocio.service.interfaces.IUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioServiceImpl implements IUsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UsuarioDTO login(String usuario, String contrasena) {
        Usuario u = usuarioRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(contrasena, u.getContrasena())) {
            throw new ResourceNotFoundException("Contraseña incorrecta");
        }

        return UsuarioMapper.toDTO(u);
    }

    @Override
    public UsuarioDTO registrarUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = UsuarioMapper.toEntity(usuarioDTO);
        // Encriptar la contraseña antes de guardar
        usuario.setContrasena(passwordEncoder.encode(usuarioDTO.getTextoContra()));
        return UsuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    @Override
    public UsuarioDTO crearUsuario(UsuarioDTO dto) {
        Usuario usuario = UsuarioMapper.toEntity(dto);
        usuario = usuarioRepository.save(usuario);
        return UsuarioMapper.toDTO(usuario);
    }

    @Override
    public List<UsuarioDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDTO obtenerPorId(String idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return UsuarioMapper.toDTO(usuario);
    }

    @Override
    public UsuarioDTO actualizarUsuario(String idUsuario, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        usuario.setNombre(dto.getNombre());
        usuario.setCorreo(dto.getCorreo());
        usuario.setTelefono(dto.getTelefono());
        usuario.setRol(dto.getRol());
        usuario.setContrasena(dto.getContrasena());

        usuario = usuarioRepository.save(usuario);
        return UsuarioMapper.toDTO(usuario);
    }

    @Override
    public void eliminarUsuario(String idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
    }
}
