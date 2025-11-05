package fisi.reservalabs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SistemaReservaLaboratoriosApplication {

    public static void main(String[] args) {
        SpringApplication.run(SistemaReservaLaboratoriosApplication.class, args);
        System.out.println("✅ Aplicación iniciada correctamente");
    }
}
