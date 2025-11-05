# 💻 Sistema de Gestión de Reservas de Laboratorios

Aplicación desarrollada con **Spring Boot** que permite gestionar de forma eficiente las **reservas y reasignaciones de laboratorios** dentro de la Facultad de Ingeniería de Sistemas e Informática (FISI) en la Universidad Nacional Mayor de San Marcos (UNMSM).  
El sistema facilita el registro, revisión, aceptación y asignación de solicitudes, además de mantener actualizados los datos de los laboratorios y de los usuarios.

---

## 🧾 Descripción del Proyecto

El sistema es una **plataforma web de gestión de reservas de laboratorios**, diseñada para optimizar el proceso de **solicitud, reasignación y administración** de espacios de laboratorio.  

Los **profesores y alumnos** pueden registrar solicitudes de reserva o reasignación de laboratorios, especificando fecha, horario y requerimientos técnicos.  
Los **empleados de gestión y asignación** revisan estas solicitudes, las aceptan o rechazan y asignan laboratorios disponibles, garantizando una correcta utilización de los recursos institucionales.

El sistema también permite registrar requerimientos técnicos, consultar disponibilidad, actualizar el estado de los laboratorios y mantener la información de los usuarios actualizada, proporcionando trazabilidad completa sobre todas las operaciones.

---

## 🧩 Características principales

- 🌐 API **RESTful** para la comunicación entre el backend y el frontend.  
- 🧱 **Arquitectura en tres capas**: Presentación, Lógica de Negocio y Datos. 
- ⚙️ Backend desarrollado con **Spring Boot (Java)**.  
- 🎨 Frontend implementado con **HTML y CSS**.  
- 🗄️ Persistencia de datos mediante **Spring Data JPA** y **MySQL**.  
- 🔒 Gestión de roles y permisos según el tipo de usuario (profesor, alumno, empleado).  
- 📅 Registro, reasignación y aceptación de solicitudes de laboratorio.  
- 🧠 Registro de requerimientos técnicos asociados a las reservas.  
- 🧾 Consulta de disponibilidad de laboratorios por fecha y horario.  
- 🧰 Actualización de estado y datos de laboratorios.  
- 👤 Mantenimiento de datos personales de los usuarios (actualización o eliminación).

---

## ⚙️ Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- [Java 21+](https://adoptium.net/)
- [Maven 3.8+](https://maven.apache.org/) 
- [Git](https://git-scm.com/)

---

## 🏗️ Instalación y ejecución

**Clonar el repositorio**

git clone https://github.com/iT0XHL/Sistema-de-Reserva-de-Laboratorios-FISI.git
cd <Sistema-de-Reserva-de-Laboratorios-FISI>
    
**Configurar la base de datos**

Edita el archivo src/main/resources/application.properties:

spring.datasource.url=jdbc:mysql://localhost:3306/<nombre_db>
spring.datasource.username=<usuario>
spring.datasource.password=<contraseña>
spring.jpa.hibernate.ddl-auto=update

**Ejecutar el proyecto**

mvn spring-boot:run

**Acceder a la aplicación**

Dirigirse a: http://localhost:8080 (ejemplo de puerto)

---