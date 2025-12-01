package fisi.reservalabs;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class SistemaReservaLaboratoriosApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaReservaLaboratoriosApplication.class, args);
        System.out.println("✅ Aplicación iniciada correctamente");
    }

    @PostConstruct
    public void init() {
        // Toda la app (Jackson, Thymeleaf, etc.) usará hora de Perú
        TimeZone.setDefault(TimeZone.getTimeZone("America/Lima"));
    }
}
