package fisi.reservalabs.capa_datos.config;


import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class GenerarHash {
    public static void main(String[] args) {
        // Cambia esta contraseña por la que quieras encriptar
        String password = "5678";

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hashedPassword = encoder.encode(password);

        System.out.println("Contraseña original: " + password);
        System.out.println("Hash generado: " + hashedPassword);
    }
}