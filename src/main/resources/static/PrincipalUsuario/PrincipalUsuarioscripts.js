document.addEventListener('DOMContentLoaded', function() {
    const transitionContainer = document.getElementById('pageTransition');
    
    // Pequeño timeout para asegurar que el navegador renderice el estado inicial antes de animar
    setTimeout(() => {
        if (transitionContainer) {
            transitionContainer.classList.add('slide-out');
        }
    }, 100);
});

// Sidebar collapse
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    collapseBtn.addEventListener('click', function() {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);

        if (isCollapsed) {
            collapseBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5"/></svg>';
        } else {
            collapseBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5"/></svg>';
        }
    });

    // Sidebar navigation  ✅ AHORA DENTRO DE DOMContentLoaded
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // Access buttons  ✅ AHORA DENTRO DE DOMContentLoaded
    document.querySelectorAll('.access-button').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    document.querySelectorAll(".btn-details").forEach(btn => {

        btn.addEventListener("click", function () {

            const id = this.getAttribute("data-id");
            const fecha = this.getAttribute("data-fecha");

            if (!id || !fecha) {
                console.error("Error: id o fecha vacíos:", id, fecha);
                return;
            }

            // Redirige usando tu endpoint real
            window.location.href = `/solicitudes/detalle?id=${id}&fecha=${fecha}`;
        });
    });
});

// ==============================
    // MENÚ DE USUARIO
    // ==============================
    const userToggle = document.getElementById('userToggle');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userToggle && userMenu) {
        userToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove('show');
            }
        });
    }

    // ==================================================================
    // LOGOUT FUNCTIONALITY
    // ==================================================================
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                window.location.href = "/loginUsuario";
            }
        });
    }

    // ==============================
    // DROPDOWN ITEMS NAVIGATION
    // ==============================
    
document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
    btn.addEventListener('click', () => {
        const destino = btn.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});
/* ==========================================
   LÓGICA DE ESTADOS (COLORES E ÍCONOS)
   ========================================== */
document.addEventListener('DOMContentLoaded', function() {
    const statusBadges = document.querySelectorAll('.reservation-status');

    statusBadges.forEach(badge => {
        // 1. Obtenemos el texto (ej: "Aceptada", "Rechazada")
        // Usamos trim() para quitar espacios y toLowerCase() para comparar fácil
        const text = badge.textContent.trim().toLowerCase();
        const iconSvg = badge.querySelector('svg path'); // Seleccionamos el trazo del ícono

        // Limpiamos clases previas
        badge.classList.remove('accepted', 'rejected', 'pending');

        // 2. Aplicamos lógica
        if (text.includes('aceptad')) {
            // VERDE
            badge.classList.add('accepted');
            // Aseguramos que el ícono sea un check (✓)
            if(iconSvg) iconSvg.setAttribute('d', 'm4.5 12.75 6 6 9-13.5');
        } 
        else if (text.includes('rechazad')) {
            // ROJO
            badge.classList.add('rejected');
            // Cambiamos el ícono a una X
            if(iconSvg) iconSvg.setAttribute('d', 'M6 18L18 6M6 6l12 12');
        } 
        else {
            // AMARILLO (Por defecto o Pendiente)
            badge.classList.add('pending');
            // Ícono de reloj o interrogación (opcional, aquí dejo un reloj)
            if(iconSvg) iconSvg.setAttribute('d', 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z');
        }
    });
});