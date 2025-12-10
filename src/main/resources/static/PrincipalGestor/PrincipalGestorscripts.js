document.addEventListener('DOMContentLoaded', () => {


    document.querySelectorAll('.access-button[data-link]').forEach(btn => {
        btn.addEventListener('click', () => {
            const destino = btn.getAttribute('data-link'); // o: btn.dataset.link
            if (destino) {
                window.location.href = destino;
            }
        });
    });
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
    // 2. Menú de usuario
    // =============================
    const userToggle = document.getElementById("userToggle");
    const userMenu = document.getElementById("userMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userToggle) {
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

    // =============================
    // 3. Submenú solicitudes
    // =============================
    const submenuBtn = document.querySelector('.submenu-btn');
    const submenu = document.querySelector('.submenu');
    const arrow = document.querySelector('.arrow');

    const SUBMENU_KEY = 'gestor_submenu_open';
    let isSubmenuOpen = localStorage.getItem(SUBMENU_KEY) === 'true';

    if (submenu && arrow && isSubmenuOpen) {
        submenu.classList.add('open');
        arrow.classList.add('open');
    }

    if (submenuBtn && submenu && arrow) {
        submenuBtn.addEventListener('click', e => {
            e.stopPropagation();
            submenu.classList.toggle('open');
            arrow.classList.toggle('open');

            isSubmenuOpen = submenu.classList.contains('open');
            localStorage.setItem(SUBMENU_KEY, isSubmenuOpen);
        });
    }

    document.querySelectorAll('.submenu-item').forEach(item => {
        item.addEventListener('click', () => {
            const link = item.getAttribute('data-link');
            if (link) window.location.href = link;
        });
    });

    // =============================
    // 4. Accesos directos
    // =============================
    document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const destino = btn.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});


    // =============================
    // 5. Colapsar menú lateral
    // =============================
    const transitionContainer = document.getElementById("pageTransition");
    setTimeout(() => transitionContainer.classList.add("slide-out"), 80);

    const sidebar    = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed  = false;

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', () => {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);
        });
    }

    // =============================
    // 6. Cargar SOLO solicitudes pendientes
    // =============================
    const contenedor = document.getElementById("pendientesHomeContainer");
    if (!contenedor) return;

    fetch("/api/solicitudes/pendientes")
        .then(res => res.json())
        .then(data => {

            contenedor.innerHTML = "";

            if (!data || data.length === 0) {
                contenedor.innerHTML = `
                    <div class="no-solicitudes">
                        No hay solicitudes pendientes
                    </div>`;
                return;
            }

            // Si quieres mostrar solo las 3 primeras en el home:
            const lista = data.slice(0, 3);  // <= quita el slice si quieres TODAS

            lista.forEach(sol => {
                const card = crearTarjetaPendiente(sol);
                contenedor.appendChild(card);
            });

            // Eventos del botón "Más detalles"
            contenedor.querySelectorAll(".btn-details").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    let fecha = btn.dataset.fecha;
                    fecha = fecha.replace(/ /g, "+");
                    window.location.href = `/solicitud/detalle?id=${id}&fecha=${fecha}`;
                });
            });

        })
        .catch(err => {
            console.error("Error cargando pendientes en home:", err);
            contenedor.innerHTML = `
                <div class="no-solicitudes">
                    Error al cargar solicitudes pendientes.
                </div>`;
        });

    // === MISMA TARJETA QUE EN /pendientes ===
    function crearTarjetaPendiente(sol) {
        const fecha = new Date(sol.fechaReserva).toLocaleDateString("es-PE", {
            timeZone: "UTC"
        });

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

});
    const transitionContainer = document.getElementById('pageTransition');
    if (transitionContainer) {
        setTimeout(() => {
            transitionContainer.classList.add('slide-out');
        }, 100);
    }
// =============================
// Helper para formatear fecha
// =============================
function formatearFecha(fechaISO) {
    if (!fechaISO) return '';

    const fecha = new Date(fechaISO);

    return fecha.toLocaleDateString('es-PE', {
        timeZone: 'UTC'
    });
}

