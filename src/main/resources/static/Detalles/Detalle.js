document.addEventListener("DOMContentLoaded", function () {

    /* --------------------------------------------------
       1. SIDEBAR (colapsar)
    -------------------------------------------------- */
    function initSidebar() {
        const sidebar = document.getElementById("sidebar");
        const collapseBtn = document.getElementById("collapseBtn");

        if (!sidebar || !collapseBtn) {
            return setTimeout(initSidebar, 80);
        }

        let isCollapsed = false;

        collapseBtn.addEventListener("click", function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle("collapsed", isCollapsed);
        });
    }
    initSidebar();

document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
    btn.addEventListener('click', () => {
        const destino = btn.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});
    /* --------------------------------------------------
       2. MENÚ USUARIO (avatar + nombre)
    -------------------------------------------------- */
    function initUserMenu() {
        const userToggle = document.getElementById("userToggle");
        const userMenu = document.getElementById("userMenu");
        const logoutBtn = document.getElementById("logoutBtn");

        if (!userToggle || !userMenu) {
            return setTimeout(initUserMenu, 100);
        }

        // Abrir / cerrar menú
        userToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            userMenu.classList.toggle("show");
        });

        // Cerrar si clickea fuera
        document.addEventListener("click", function (e) {
            if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove("show");
            }
        });

        // Logout
        if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                window.location.href = "/loginGestor";
            }
        });
    }
    }
    initUserMenu();


    /* --------------------------------------------------
       3. SUBMENU del sidebar (Solicitudes)
    -------------------------------------------------- */
    function initSubmenu() {
        const submenuBtn = document.querySelector(".submenu-btn");
        const submenu = document.querySelector(".submenu");
        const arrow = document.querySelector(".arrow");

        if (!submenuBtn || !submenu || !arrow) return;

        const KEY = "gestor_submenu_open";
        let open = localStorage.getItem(KEY) === "true";

        if (open) {
            submenu.classList.add("open");
            arrow.classList.add("open");
        }

        submenuBtn.addEventListener("click", function () {
            submenu.classList.toggle("open");
            arrow.classList.toggle("open");

            localStorage.setItem(KEY, submenu.classList.contains("open"));
        });
    }
    initSubmenu();


    /* --------------------------------------------------
       4. NAVEGACIÓN CORRECTA DEL SIDEBAR
    -------------------------------------------------- */
    function initSidebarNavigation() {

        // Items principales
        document.querySelectorAll(".menu-item").forEach(item => {
            item.addEventListener("click", function () {

                const link = this.getAttribute("data-link");
                if (link) window.location.href = link;
            });
        });

        // Items del submenú
        document.querySelectorAll(".submenu-item").forEach(sub => {
            sub.addEventListener("click", function () {

                const link = this.getAttribute("data-link");
                if (link) window.location.href = link;
            });
        });

        // Botón asignar
        document.querySelectorAll(".btn-assign").forEach(btn => {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                const href = this.getAttribute("href");
                if (href) window.location.href = href;
            });
        });
    }
    initSidebarNavigation();


    /* --------------------------------------------------
       5. MODAL ACEPTAR SOLICITUD
    -------------------------------------------------- */
    const btnAceptar = document.querySelector(".btn-accept");
    const modalAceptado = document.getElementById("modalAceptado");
    const btnModalOk = document.getElementById("btnModalOk");

    if (btnAceptar && modalAceptado) {

        btnAceptar.addEventListener("click", function (e) {
            e.preventDefault();
            modalAceptado.classList.add("show");
        });

        btnModalOk.addEventListener("click", function () {

            const idSolicitud = btnAceptar.getAttribute("data-id");
            const fechaSolicitud = btnAceptar.getAttribute("data-fecha");

            if (!idSolicitud || !fechaSolicitud) {
                alert("No se pudo obtener la información de la solicitud.");
                return;
            }

            const params = new URLSearchParams();
            params.append("idSolicitud", idSolicitud);
            params.append("fechaSolicitud", fechaSolicitud);

            fetch("/solicitudes/aceptar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString()
            })
                .then(response => {
                    if (response.ok) {
                        modalAceptado.classList.remove("show");
                        window.location.href = "/historial";
                    } else {
                        alert("Error al aceptar la solicitud.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al comunicar con el servidor.");
                });
        });
    }


    /* --------------------------------------------------
       6. MODAL RECHAZAR SOLICITUD
    -------------------------------------------------- */
    const btnRechazar = document.querySelector(".btn-reject");
    const modalRechazar = document.getElementById("modalRechazar");
    const btnCancelarRechazo = document.getElementById("btnRechazoCancelar");
    const btnConfirmarRechazo = document.getElementById("btnRechazoConfirmar");
    const textareaMotivo = document.getElementById("motivoRechazo");

    if (btnRechazar && modalRechazar) {

        btnRechazar.addEventListener("click", function () {
            modalRechazar.classList.add("show");
        });

        btnCancelarRechazo.addEventListener("click", function () {
            modalRechazar.classList.remove("show");
            textareaMotivo.value = "";
        });

        btnConfirmarRechazo.addEventListener("click", function () {

            const motivo = textareaMotivo.value.trim();
            if (motivo === "") {
                alert("Debes indicar el motivo del rechazo.");
                return;
            }

            const idSolicitud = btnRechazar.getAttribute("data-id");
            const fechaSolicitud = btnRechazar.getAttribute("data-fecha");

            if (!idSolicitud || !fechaSolicitud) {
                alert("No se pudo obtener la información de la solicitud.");
                return;
            }

            const params = new URLSearchParams();
            params.append("idSolicitud", idSolicitud);
            params.append("fechaSolicitud", fechaSolicitud);
            params.append("motivo", motivo);

            fetch("/solicitudes/rechazar", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString()
            })
                .then(response => {
                    if (response.ok) {
                        modalRechazar.classList.remove("show");
                        textareaMotivo.value = "";
                        window.location.href = "/historial";
                    } else {
                        alert("No se pudo rechazar la solicitud.");
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al comunicar con el servidor.");
                });
        });
    }

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
