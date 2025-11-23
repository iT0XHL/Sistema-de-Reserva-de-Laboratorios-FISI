document.addEventListener('DOMContentLoaded', function () {

    // ----- SIDEBAR -----
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    collapseBtn.addEventListener('click', function () {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) window.location.href = destino;
        });
    });

    // ---- SUBMENU ----
    const submenuBtn = document.querySelector(".submenu-btn");
    const submenu = document.querySelector(".submenu");
    const arrow = document.querySelector(".arrow");

    submenuBtn.addEventListener("click", () => {
        submenu.classList.toggle("open");
        arrow.classList.toggle("open");
    });

    document.querySelectorAll(".submenu-item").forEach(item => {
        item.addEventListener("click", () => {
            const link = item.getAttribute("data-link");
            if (link) window.location.href = link;
        });
    });

    // ---- USUARIO ----
    const userToggle = document.getElementById('userToggle');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    userToggle.addEventListener('click', function (e) {
        e.stopPropagation();
        userMenu.classList.toggle('show');
    });

    document.addEventListener('click', function (e) {
        if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('show');
        }
    });

    logoutBtn.addEventListener('click', function () {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            window.location.href = '/logout';
        }
    });

// -----------------------------------------------------
// CARGAR SOLICITUDES DE REASIGNACIÓN DEL GESTOR
// -----------------------------------------------------
const contenedor = document.getElementById("solicitudesContainer");

fetch("/api/solicitudes/reasignacion")
    .then(resp => resp.json())
    .then(data => {

        if (data.length === 0) {
            contenedor.innerHTML = `
                <div class="no-solicitudes">
                    No hay solicitudes para reasignación.
                </div>
            `;
            return;
        }

        data.forEach(sol => {

            const div = document.createElement("div");
            div.classList.add("solicitud-card");

            div.innerHTML = `
                <!-- ESTADO -->
                <div class="status-badge pending">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Pendiente
                </div>

                <!-- TÍTULO -->
                <h3>Solicitud #${sol.idSolicitud}</h3>

                <!-- DETALLES -->
                <div class="solicitud-details">

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                        </svg>
                        <span>Lab: ${sol.idLaboratorio ?? "Por asignar"}</span>
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Fecha: <span>${sol.fechaReserva ?? "Sin fecha"}</span>
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Hora:
                        <span>${sol.horaInicio ?? "-"} - ${sol.horaFin ?? "-"}</span>
                    </div>

                </div>

                <button class="btn-details" data-id="${sol.idSolicitud}">
                    Más detalles
                </button>
            `;

            contenedor.appendChild(div);
        });

        // EVENTO: BOTÓN "Más detalles"
        document.querySelectorAll(".btn-details").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                window.location.href = `/reasignar/${id}`;
            });
        });

    });


            })
        .catch(err => {
            console.error("Error cargando solicitudes de reasignación:", err);
            contenedor.innerHTML = "<p>Error al cargar las solicitudes.</p>";
        });


