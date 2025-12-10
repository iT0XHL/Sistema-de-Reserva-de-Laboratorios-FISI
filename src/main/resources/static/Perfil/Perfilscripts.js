document.addEventListener('DOMContentLoaded', function () {

    // ==========================
    // 0. Rol actual (para logout)
    // ==========================
    const rol = (document.body.getAttribute('data-rol') || '')
        .toUpperCase()
        .trim(); // "GESTOR", "ESTUDIANTE", etc.

    // ==========================
    // 1. Transición de página
    // ==========================
    const transitionContainer = document.getElementById('pageTransition');
    if (transitionContainer) {
        setTimeout(() => {
            transitionContainer.classList.add('slide-out');
        }, 100);
    }

    // ==========================
    // 2. Sidebar (colapsar + links)
    // ==========================
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');

    if (sidebar && collapseBtn) {
        let isCollapsed = false;
        collapseBtn.addEventListener('click', function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);
            collapseBtn.innerHTML = isCollapsed
                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>`;
        });
    }

    // Navegación de items del sidebar (los que tienen data-link)
    document.querySelectorAll('.menu-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // ==========================
    // 3. Submenú "Solicitudes" (si existe)
    // ==========================
    const submenuBtn = document.querySelector('.submenu-btn');
    const submenu    = document.querySelector('.submenu');
    const arrow      = submenuBtn ? submenuBtn.querySelector('.arrow') : null;

    // Abrir/cerrar submenú al hacer click en "Solicitudes"
    if (submenuBtn && submenu) {
        submenuBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            submenu.classList.toggle('open');
            if (arrow) {
                arrow.classList.toggle('open');
            }
        });
    }

    // Click en "Solicitudes Pendientes" / "Historial"
    document.querySelectorAll('.submenu-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // ==========================
    // 4. Menú de usuario (top-right)
    // ==========================
    const userToggle = document.getElementById('userToggle');
    const userMenu   = document.getElementById('userMenu');

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

    // Navegación de opciones del menú (Mi Perfil)
    document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const destino = btn.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;   // /perfil o /gestor/perfil (según el HTML)
            }
        });
    });

    // ==========================
    // 5. Logout
    // ==========================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                // Si es gestor → loginGestor, si no → loginUsuario
                const destinoLogout = (rol === 'GESTOR')
                    ? '/loginGestor'
                    : '/loginUsuario';

                window.location.href = destinoLogout;
            }
        });
    }
});
