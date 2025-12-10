document.addEventListener("DOMContentLoaded", function () {

    // ==================================================================
    // 1. Inicializar SIDEBAR (aunque el fragmento cargue después)
    // ==================================================================
    function initSidebar() {
        const sidebar = document.getElementById("sidebar");
        const collapseBtn = document.getElementById("collapseBtn");

        // Si aún no existe el fragmento → reintentar
        if (!sidebar || !collapseBtn) {
            setTimeout(initSidebar, 100);
            return;
        }

        let isCollapsed = false;

        collapseBtn.addEventListener("click", function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle("collapsed", isCollapsed);

            collapseBtn.innerHTML = isCollapsed
                ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
                   </svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 24 24" stroke-width="1.5">
                        <path stroke-linecap="round" stroke-linejoin="round" 
                              d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
                   </svg>`;
        });
    }

    initSidebar(); // Llamar inmediatamente


    // ==================================================================
    // 2. MENÚ SUPERIOR DEL USUARIO
    // ==================================================================
    function initUserMenu() {
        const userToggle = document.getElementById("userToggle");
        const userMenu   = document.getElementById("userMenu");
        const logoutBtn  = document.getElementById("logoutBtn");

        if (!userToggle || !userMenu) {
            setTimeout(initUserMenu, 100);
            return;
        }

        userToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            userMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
            if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove("show");
            }
        });

        // Logout → loginUsuario (es vista de usuario)
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm("¿Seguro que deseas cerrar sesión?")) {
                    window.location.href = "/loginUsuario";
                }
            });
        }
    }

    initUserMenu();


    // ==================================================================
    // 3. BOTÓN REASIGNAR
    // ==================================================================
    document.addEventListener("click", function (e) {
        const btn = e.target.closest(".btn-reassign");
        if (!btn) return;

        e.preventDefault();
        const url = btn.getAttribute("href");
        if (url) window.location.href = url;
    });


    // ==================================================================
    // 4. "Mi Perfil" desde el menú desplegable
    // ==================================================================
    document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const destino = btn.getAttribute('data-link');
            if (destino) {
                window.location.href = destino; // /perfil en este caso
            }
        });
    });


    // ==================================================================
    // 5. ACTIVAR NAVEGACIÓN DEL SIDEBAR (Delegación de Eventos)
    // ==================================================================
    document.addEventListener('click', function(e) {
        const menuItem = e.target.closest('.menu-item[data-link]');
        if (!menuItem) return;

        const destino = menuItem.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });


    // ==================================================================
    // 6. LIMPIAR FORMATO DE REQUERIMIENTOS (por si vienen como JSON)
    // ==================================================================
    const reqSpan = document.getElementById('reqText');
    if (reqSpan) {
        const raw = reqSpan.textContent.trim();

        // Si parece un array JSON, ej: ["A","B","C"]
        if (raw.startsWith('[') && raw.endsWith(']')) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    // lo mostramos como texto con comas
                    reqSpan.textContent = parsed.join(', ');
                }
            } catch (err) {
                console.error('No se pudo parsear requerimientos:', err);
                // Si falla, lo dejamos tal cual
            }
        }
    }

});