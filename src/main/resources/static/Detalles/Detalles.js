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
        const userMenu = document.getElementById("userMenu");
        const logoutBtn = document.getElementById("logoutBtn");

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

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                if (confirm("¿Seguro que deseas cerrar sesión?")) {
                    window.location.href = "/login";
                }
            });
        }
    }

    initUserMenu();


    // ==================================================================
    // 3. BOTÓN REASIGNAR
    // ==================================================================
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("btn-reassign")) {
            const url = e.target.getAttribute("href");
            if (url) window.location.href = url;
        }
    });

    // ==============================
// 4. ACTIVAR NAVEGACIÓN DEL SIDEBAR
// ==============================
document.querySelectorAll(".menu-item").forEach(item => {
    item.style.cursor = "pointer";

    item.addEventListener("click", () => {
        const url = item.getAttribute("data-link");
        if (url) {
            window.location.href = url;
        }
    });
});

});
