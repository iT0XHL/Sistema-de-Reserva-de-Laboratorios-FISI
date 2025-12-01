// LoginUsuarioScripts.js

// -------------------------------
// FUNCIONES PARA EL MODAL DE ERROR
// -------------------------------

// Mostrar modal de error
function showModal(message = "Usuario o contraseña incorrectos") {
    const modal = document.getElementById('errorModal');
    modal.querySelector('.modal-title').textContent = message;
    modal.style.display = 'flex';
}

// Cerrar modal
function closeModal() {
    const modal = document.getElementById('errorModal');
    modal.style.display = 'none';
}

// Cerrar modal si se hace click fuera del contenido
window.onclick = function(event) {
    const modal = document.getElementById('errorModal');
    if (event.target === modal) {
        closeModal();
    }
};

// -------------------------------
// FUNCIÓN PRINCIPAL DE LOGIN
// -------------------------------

// Función de login
function login() {
    const usuario = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación de vacíos
    if (usuario === '' || password === '') {
        showModal("Por favor ingrese usuario y contraseña");
        return;
    }

    // Petición al backend
    fetch('http://localhost:8080/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // IMPORTANTE para la sesión
        body: JSON.stringify({
            usuario: usuario,
            textoContra: password
        })
    })
    .then(async response => {
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Datos incorrectos");
        }
        return response.json();
    })
    .then(data => {
        console.log("Login exitoso:", data);

        // Guardar el usuario en localStorage
        const usuarioData = {
            idUsuario: data.idUsuario,  // Guardamos el idUsuario
            usuario: data.usuario,
            nombre: data.nombre,
            correo: data.correo,
            telefono: data.telefono,
            rol: data.rol
        };
        localStorage.setItem('usuario', JSON.stringify(usuarioData)); // Guarda el usuario en localStorage

        // Redirigir a la página principal del usuario
        window.location.href = '/principalUsuario';
    })
    .catch(error => {
        console.error("Error de login:", error);
        showModal("Usuario o contraseña incorrectos");
    });
}


// -------------------------------
// MOSTRAR / OCULTAR CONTRASEÑA
// -------------------------------

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    passwordField.type = (passwordField.type === 'password') ? 'text' : 'password';
}
