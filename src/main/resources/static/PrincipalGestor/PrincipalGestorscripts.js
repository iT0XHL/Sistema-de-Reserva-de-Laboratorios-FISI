document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 1. Navegación del menú lateral
    // =============================
    document.querySelectorAll('.menu-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) window.location.href = destino;
        });
    });

    // =============================
    // 2. Menú de usuario (perfil)
    // =============================
    const userToggle = document.getElementById('userToggle');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userToggle && userMenu) {
        userToggle.addEventListener('click', e => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });

        document.addEventListener('click', e => {
            if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove('show');
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                window.location.href = '/loginGestor';
            }
        });
    }

    // =============================
    // 3. Submenú "Solicitudes" con estado persistente
    // =============================
    const submenuBtn = document.querySelector('.submenu-btn');
    const submenu    = document.querySelector('.submenu');
    const arrow      = document.querySelector('.arrow');

    const SUBMENU_KEY = 'gestor_submenu_open';
    let isSubmenuOpen = localStorage.getItem(SUBMENU_KEY) === 'true';

    // Restaurar estado guardado
    if (submenu && arrow && isSubmenuOpen) {
        submenu.classList.add('open');
        arrow.classList.add('open');
    }

    if (submenuBtn && submenu && arrow) {
        submenuBtn.addEventListener('click', e => {
            e.stopPropagation();
            submenu.classList.toggle('open');
            arrow.classList.toggle('open');

            // guardar estado actual
            isSubmenuOpen = submenu.classList.contains('open');
            localStorage.setItem(SUBMENU_KEY, isSubmenuOpen);
        });
    }

    // Click en las opciones del submenú
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.addEventListener('click', () => {
            const link = item.getAttribute('data-link');
            if (link) window.location.href = link;
        });
    });

    // =============================
    // 4. Botones de accesos directos
    // =============================
    document.querySelectorAll('.access-button').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) window.location.href = destino;
        });
    });

    // =============================
    // 5. Colapsar menú lateral
    // =============================
    const sidebar    = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed  = false;

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', () => {

            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            // Cambiar icono
            collapseBtn.innerHTML = isCollapsed
                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>`;

            // Al colapsar, solo ocultamos visualmente el submenú,
            // pero NO cambiamos isSubmenuOpen ni lo borramos del localStorage
            if (isCollapsed) {
                if (submenu) submenu.classList.remove('open');
                if (arrow)   arrow.classList.remove('open');
            } else {
                // Si estaba abierto antes de colapsar, lo volvemos a mostrar
                if (submenu && isSubmenuOpen) submenu.classList.add('open');
                if (arrow && isSubmenuOpen)   arrow.classList.add('open');
            }
        });
    }

});
