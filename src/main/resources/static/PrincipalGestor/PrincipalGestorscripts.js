document.addEventListener('DOMContentLoaded', () => {

    // =============================
    // 1. Navegación del menú lateral
    // =============================
    document.querySelectorAll('.menu-item').forEach(item => {
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

    // Cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                window.location.href = '/loginGestor'; 
            }
        });
    }

    // =============================
    // 3. Submenú 
    // =============================
    const submenuBtn = document.querySelector(".submenu-btn");
    const submenu = document.querySelector(".submenu");
    const arrow = document.querySelector(".arrow");

    if (submenuBtn && submenu && arrow) {
        submenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            if (document.getElementById("sidebar").classList.contains("collapsed")) return;

            submenu.classList.toggle("open");
            arrow.classList.toggle("open");
        });
    }

    // Click sobre elementos del submenú
    document.querySelectorAll(".submenu-item").forEach(item => {
        item.addEventListener("click", () => {
            const link = item.getAttribute("data-link");
            if (link) window.location.href = link;
        });
    });

    // Access buttons
    document.querySelectorAll('.access-button').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // =============================
    // 4. Colapsar menú lateral
    // =============================
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', () => {

            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            // Cambiar icono
            collapseBtn.innerHTML = isCollapsed
                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>`;

            // Submenú cuando se colapsa
            if (isCollapsed) {
                if (submenu) submenu.classList.remove("open");
                if (submenu) submenu.style.display = "none";
                if (arrow) {
                    arrow.classList.remove("open");
                    arrow.style.display = "none";
                }
            } else {
                // Restaurar visual
                if (submenu) submenu.style.display = "";
                if (arrow) arrow.style.display = "";
            }
        });
    }

});
