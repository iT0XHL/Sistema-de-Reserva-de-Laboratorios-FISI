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
function login(event) {

    event.preventDefault();

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

        const transitionContainer = document.querySelector('.transition-container');
            if (transitionContainer) {
                transitionContainer.classList.add('active');
        }

        setTimeout(() => {
            window.location.href = '/principalUsuario';
        }, 800); 
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
    const toggleButton = document.querySelector('.password-toggle');

    if (passwordField.type === 'password') {
        // 1. Mostrar contraseña
        passwordField.type = 'text';
        
        // 2. Cambiar ícono a "Ojo Tachado" (Ocultar)
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        `;
    } else {
        // 1. Ocultar contraseña
        passwordField.type = 'password';
        
        // 2. Cambiar ícono a "Ojo Normal" (Ver)
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
        `;
    }
}