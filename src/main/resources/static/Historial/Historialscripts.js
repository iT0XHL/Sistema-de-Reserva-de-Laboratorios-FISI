document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================
    //  ANIMACIÓN DE TRANSICIÓN
    // ==========================================================
    const transitionContainer = document.getElementById("pageTransition");
    if (transitionContainer) {
        setTimeout(() => transitionContainer.classList.add("slide-out"), 80);
    }

    // ==========================================================
    //  SIDEBAR
    // ==========================================================
    const sidebar = document.getElementById("sidebar");
    const collapseBtn = document.getElementById("collapseBtn");

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed");
        });
    }

    // Navegación del sidebar
    document.querySelectorAll(".menu-item[data-link], .submenu-item[data-link]")
        .forEach(item => {
            item.addEventListener("click", () => {
                const destino = item.getAttribute("data-link");
                if (destino) window.location.href = destino;
            });
        });

    // Submenús del sidebar
    document.querySelectorAll(".submenu-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const submenu = btn.nextElementSibling;
            const arrow = btn.querySelector(".arrow");

            if (submenu) submenu.classList.toggle("open");
            if (arrow)   arrow.classList.toggle("open");
        });
    });

    // ==========================================================
    //  MENÚ DE USUARIO
    // ==========================================================
    const userToggle = document.getElementById("userToggle");
    const userMenu   = document.getElementById("userMenu");
    const logoutBtn  = document.getElementById("logoutBtn");

    if (userToggle && userMenu) {
        userToggle.addEventListener("click", function (e) {
            e.stopPropagation();
            userMenu.classList.toggle("show");
        });

        document.addEventListener("click", function (e) {
            if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove("show");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                window.location.href = "/loginGestor";
            }
        });
    }

    // Dropdown "Mi perfil"
    document.querySelectorAll(".dropdown-item[data-link]").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            const destino = btn.getAttribute("data-link");
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // ==========================================================
    //  CARGAR SOLICITUDES: ACEPTADAS + RECHAZADAS
    // ==========================================================
    const contenedor = document.getElementById("historialContainer");
    if (!contenedor) return;

    // Iconos pequeños para el badge
    const iconAceptada = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7l3 3 6-6"></path>
        </svg>
    `;

    const iconRechazada = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
             fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="4" x2="10" y2="10"></line>
            <line x1="10" y1="4" x2="4" y2="10"></line>
        </svg>
    `;

    Promise.all([
        fetch("/api/solicitudes/aceptadas").then(res => res.json()),
        fetch("/api/solicitudes/rechazadas").then(res => res.json())
    ])
    .then(([aceptadas, rechazadas]) => {

        if ((!aceptadas || aceptadas.length === 0) &&
            (!rechazadas || rechazadas.length === 0)) {

            contenedor.innerHTML = `
                <div class="no-solicitudes">
                    No existen solicitudes en el historial.
                </div>`;
            return;
        }

        contenedor.innerHTML = "";

        // ---------- función para crear una tarjeta ----------
        function crearTarjeta(sol, estadoClase, iconSvg, esRechazada) {

            const fecha = sol.fechaReserva
                ? new Date(sol.fechaReserva).toLocaleDateString("es-PE", { timeZone: "UTC" })
                : "Sin fecha";

            // Normalizamos fechaSolicitud a ISO para usarla en el enlace del reporte
            const fechaSolicitudIso = sol.fechaSolicitud
                ? new Date(sol.fechaSolicitud).toISOString()
                : "";

            // ---------- Tipo de solicitud (ASIGNACION / REASIGNACION) ----------
            const tipoRaw   = (sol.tipo || "").toUpperCase();
            const esReasig  = tipoRaw === "REASIGNACION";
            const tipoLabel = esReasig ? "Reasignación" : "Asignación";

            const iconTipo = esReasig
                ? `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M4.5 4.5v6h6M19.5 19.5v-6h-6M5.25 19.5A8.25 8.25 0 0 0 18 9.75h1.5M6 14.25A8.25 8.25 0 0 1 18.75 4.5H17.25" />
                </svg>
                `
                : `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12h6m-3-3v6m-6 7.5h12A2.25 2.25 0 0020.25 20V7.5
                             L15 2.25H6A2.25 2.25 0 003.75 4.5v15A2.25 2.25 0 006 21z" />
                </svg>
                `;

            const div = document.createElement("div");
            div.classList.add("solicitud-card");

            div.innerHTML = `
                <div class="status-badge ${estadoClase}">
                    ${iconSvg}
                    ${sol.estado}
                </div>

                <h3>Solicitud #${sol.idSolicitud}</h3>

                <div class="solicitud-details">

                
                    <!-- Tipo de solicitud -->
                    <div class="detail-item">
                        ${iconTipo}
                        Tipo: ${tipoLabel}
                    </div>
                    
                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v9A2.25 2.25 0 0 1 18.75 16.5H5.25A2.25 2.25 0 0 1 3 14.25v-9Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M2.25 18h19.5" />
                        </svg>
                        Lab: ${sol.idLaboratorio ?? "Por asignar"}
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Fecha: ${fecha}
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Hora: ${sol.horaInicio} - ${sol.horaFin}
                    </div>
                </div>

                ${
                    esRechazada
                    ? `<div class="actions-row">
                           <button class="btn-report"
                                   data-id="${sol.idSolicitud}"
                                   data-fecha="${fechaSolicitudIso}">
                               Ver reporte
                           </button>
                       </div>`
                    : ""
                }
            `;

            return div;
        }

        // ACEPTADAS
        aceptadas.forEach(sol => {
            contenedor.appendChild(
                crearTarjeta(sol, "accepted", iconAceptada, false)
            );
        });

        // RECHAZADAS (con botón "Ver reporte")
        rechazadas.forEach(sol => {
            contenedor.appendChild(
                crearTarjeta(sol, "rejected", iconRechazada, true)
            );
        });

        // Eventos para "Ver reporte" (solo rechazadas)
        contenedor.querySelectorAll(".btn-report").forEach(btn => {
            btn.addEventListener("click", () => {
                const id    = btn.dataset.id;
                const fecha = btn.dataset.fecha;   // ISO-8601

                const fechaParam = encodeURIComponent(fecha);
                window.location.href = `/solicitud/reporte?id=${id}&fecha=${fechaParam}`;
            });
        });

    })
    .catch(err => {
        console.error("Error cargando historial:", err);
        contenedor.innerHTML = `
            <div class="no-solicitudes">
                Error al cargar historial.
            </div>`;
    });

});
