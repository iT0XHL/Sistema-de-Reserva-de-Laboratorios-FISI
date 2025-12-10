document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================
    //  ANIMACIÓN DE TRANSICIÓN
    // ==========================================================
    const transitionContainer = document.getElementById("pageTransition");
    setTimeout(() => transitionContainer?.classList.add("slide-out"), 80);


    // ==========================================================
    //  SIDEBAR
    // ==========================================================
    const sidebar = document.getElementById("sidebar");
    const collapseBtn = document.getElementById("collapseBtn");

    if (collapseBtn) {
        collapseBtn.addEventListener("click", function () {
            sidebar.classList.toggle("collapsed");
        });
    }

    document.querySelectorAll(".menu-item, .submenu-item").forEach(item => {
        item.addEventListener("click", () => {
            const destino = item.getAttribute("data-link");
            if (destino) window.location.href = destino;
        });
    });

    document.querySelectorAll(".submenu-btn").forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.stopPropagation();
            const submenu = btn.nextElementSibling;
            const arrow = btn.querySelector(".arrow");
            submenu.classList.toggle("open");
            arrow.classList.toggle("open");
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
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                window.location.href = "/loginGestor";
            }
        });
    }


    // ==========================================================
    //  🔥 CARGAR SOLO SOLICITUDES PENDIENTES
    // ==========================================================
    const contenedor = document.getElementById("solicitudesContainer");

    fetch("/api/solicitudes/pendientes")
        .then(res => res.json())
        .then(data => {

            console.log("Pendientes desde API (JS):", data.length, data.map(s => s.idSolicitud));

            contenedor.innerHTML = "";

            if (!data || data.length === 0) {
                contenedor.innerHTML = `
                <div class="no-solicitudes">
                    No hay solicitudes pendientes
                </div>`;
                return;
            }

            // ==========================
            // FUNCIÓN PARA CREAR TARJETA
            // ==========================
            function crearTarjeta(sol) {
                const fecha = sol.fechaReserva
                    ? new Date(sol.fechaReserva).toLocaleDateString("es-PE", { timeZone: "UTC" })
                    : "Sin fecha";

                // ----------------------------
                // TIPO DE SOLICITUD + ICONO
                // ----------------------------
                const tipoRaw = (sol.tipo || "").toUpperCase();   // campo del DTO: tipo = "ASIGNACION"/"REASIGNACION"
                let tipoTexto = "Desconocido";
                let tipoIcono = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                `;

                if (tipoRaw === "ASIGNACION") {
                    tipoTexto = "Asignación";
                    tipoIcono = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M9 12h6m-3-3v6m-6 7.5h12A2.25 2.25 0 0020.25 20V7.5
                                     L15 2.25H6A2.25 2.25 0 003.75 4.5v15A2.25 2.25 0 006 21z" />
                        </svg>
                    `;
                } else if (tipoRaw === "REASIGNACION") {
                    tipoTexto = "Reasignación";
                    tipoIcono = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M4.5 10.5 9 6m0 0L4.5 1.5M9 6H6a6 6 0 00-6 6v2.25
                                     M19.5 13.5 15 18m0 0 4.5 4.5M15 18h3a6 6 0 006-6V9.75" />
                        </svg>
                    `;
                }

                const div = document.createElement("div");
                div.classList.add("solicitud-card");

                div.innerHTML = `
                <div class="status-badge pending">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Pendiente
                </div>

                <h3>Solicitud #${sol.idSolicitud}</h3>

                <div class="solicitud-details">
                    <!-- 🔹 TIPO DE SOLICITUD -->
                    <div class="detail-item">
                        ${tipoIcono}
                        Tipo: ${tipoTexto}
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v9A2.25 2.25 0 0 1 18.75 16.5H5.25A2.25 2.25 0 0 1 3 14.25v-9Z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.25 18h19.5" />
                        </svg>
                        Lab: ${sol.idLaboratorio ?? "Por asignar"}
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
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

                <button class="btn-details"
                    data-id="${sol.idSolicitud}"
                    data-fecha="${sol.fechaSolicitud}">
                    Más detalles
                </button>
            `;

                return div;
            }

            // Render tarjetas
            data.forEach((sol, idx) => {
                try {
                    const card = crearTarjeta(sol);
                    contenedor.appendChild(card);
                } catch (e) {
                    console.error("Error renderizando solicitud", idx, sol, e);
                }
            });

            console.log(
                "Tarjetas en el DOM:",
                document.querySelectorAll(".solicitud-card").length
            );

            // Eventos "Más detalles"
            document.querySelectorAll(".btn-details").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    let   fecha = btn.dataset.fecha;
                    fecha = fecha.replace(/ /g, "+");
                    window.location.href = `/solicitud/detalle?id=${id}&fecha=${fecha}`;
                });
            });

        })
        .catch(err => {
            console.error("Error cargando solicitudes pendientes:", err);
            contenedor.innerHTML = `
            <div class="no-solicitudes">
                Error al cargar solicitudes pendientes.
            </div>`;
        });

});
