// LoginGestorScripts.js

// -------------------------------
// FUNCIONES PARA EL MODAL DE ERROR
// -------------------------------

// Mostrar modal de error con mensaje
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

// Cerrar modal si se hace click fuera
window.onclick = function(event) {
    const modal = document.getElementById('errorModal');
    if (event.target === modal) {
        closeModal();
    }
};

// -------------------------------
// FUNCIÓN PRINCIPAL DE LOGIN GESTOR
// -------------------------------

function loginGestor() {
    const usuario = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación de campos vacíos
    if (usuario === '' || password === '') {
        showModal("Por favor ingrese usuario y contraseña");
        return;
    }

    // Petición al backend del GESTOR
    fetch('http://localhost:8080/api/empleados/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Para guardar sesión
        body: JSON.stringify({
            usuarioLogin: usuario,
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
        console.log("Login Gestor exitoso:", data);

        // Redirección al panel principal del gestor
        window.location.href = '/principalGestor';
    })
    .catch(error => {
        console.error("Error login gestor:", error);
        showModal("Usuario o contraseña incorrectos");
    });
}

// -------------------------------
// MOSTRAR / OCULTAR CONTRASEÑA
// -------------------------------

function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    passwordField.type = (passwordField.type === 'password') ? 'text' : 'password';

    const eyeIcon = document.querySelector('.password-toggle svg');
    
    if (passwordField.type === 'text') {
        // ojo cerrado
        eyeIcon.innerHTML =
            '<path d="M17.293 13.293A8 8 0 016.707 2.707l10.586 10.586z"></path>' +
            '<path d="M1 1l22 22"></path>' +
            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>';
    } else {
        // ojo abierto
        eyeIcon.innerHTML =
            '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>' +
            '<circle cx="12" cy="12" r="3"></circle>';
    }
}
