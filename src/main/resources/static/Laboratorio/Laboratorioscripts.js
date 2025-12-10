document.addEventListener("DOMContentLoaded", () => {
    inicializarSidebar();
    cargarMenuUsuario();

    const filtro = document.getElementById("filtroEstado");

    if (filtro) {
        filtro.addEventListener("change", () => {
            cargarSolicitudes(filtro.value);
        });

        // carga inicial (lo que esté seleccionado, o "todos")
        cargarSolicitudes(filtro.value || "todos");
    }
});

document.querySelectorAll('.menu-item[data-link]').forEach(item => {
    item.addEventListener('click', function () {
        const destino = this.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});

/* ---------------------------------------------
    1. Sidebar
------------------------------------------------*/
function inicializarSidebar() {
    const sidebar = document.getElementById("sidebar");
    const collapseBtn = document.getElementById("collapseBtn");

    if (collapseBtn) {
        collapseBtn.addEventListener("click", () => {
            if (sidebar) {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    // Navegación de items (menu + submenu)
    document.addEventListener("click", (e) => {
        const item = e.target.closest(".menu-item[data-link], .submenu-item[data-link]");
        if (!item) return;

        const destino = item.getAttribute("data-link");
        if (destino) {
            window.location.href = destino;
        }
    });

    const submenuBtn = document.querySelector(".submenu-btn");
    const submenu    = document.querySelector(".submenu");
    const arrow      = submenuBtn ? submenuBtn.querySelector(".arrow") : null;

    if (submenuBtn && submenu) {
        submenuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            submenu.classList.toggle("open");
            if (arrow) {
                arrow.classList.toggle("open");
            }
        });
    }
}

/* ---------------------------------------------
    2. Cargar solicitudes según filtro (TIPO)
    → SIEMPRE estado = ACEPTADA
------------------------------------------------*/
async function cargarSolicitudes(filtro) {
    const contenedor = document.getElementById("solicitudesContainer");

    if (!contenedor) return;

    contenedor.innerHTML = "<div class='loading'>Cargando...</div>";

    let url = "";

    // Ahora usamos SOLO solicitudes ACEPTADAS
    switch (filtro) {
        case "todos":
            // todas las solicitudes ACEPTADAS (cualquier tipo)
            url = "/api/solicitudes/aceptadas";
            break;
        case "asignacion":
            // solicitudes ACEPTADAS y tipo = 'ASIGNACION'
            url = "/api/solicitudes/aceptadas/asignacion";
            break;
        case "reasignacion":
            // solicitudes ACEPTADAS y tipo = 'REASIGNACION'
            url = "/api/solicitudes/aceptadas/reasignacion";
            break;
        default:
            url = "/api/solicitudes/aceptadas";
    }

    try {
        const resp = await fetch(url);
        const solicitudes = await resp.json();

        if (!Array.isArray(solicitudes) || solicitudes.length === 0) {
            contenedor.innerHTML = `
                <div class="no-solicitudes">No hay solicitudes en esta categoría</div>
            `;
            return;
        }

        contenedor.innerHTML = "";

        solicitudes.forEach(s => {
            contenedor.appendChild(crearTarjetaSolicitud(s));
        });

    } catch (e) {
        contenedor.innerHTML = "<div class='no-solicitudes'>Error cargando datos</div>";
        console.error("Error:", e);
    }
}

/* ---------------------------------------------
    3. Crear tarjeta
------------------------------------------------*/
function crearTarjetaSolicitud(s) {
    const card = document.createElement("div");
    card.classList.add("solicitud-card");

    const lab = s.idLaboratorio ? s.idLaboratorio : "Por asignar";

    // FECHA FORMATEADA (usando fechaReserva)
    let fechaFormateada = "—";

    if (s.fechaReserva) {
        try {
            const fecha = new Date(s.fechaReserva);
            if (!isNaN(fecha)) {
                const dia  = String(fecha.getDate()).padStart(2, "0");
                const mes  = String(fecha.getMonth() + 1).padStart(2, "0");
                const anio = fecha.getFullYear();
                fechaFormateada = `${dia}/${mes}/${anio}`;
            }
        } catch (_) {}
    }

    // Badge según campo TIPO (ASIGNACION / REASIGNACION)
    const tipo = (s.tipo || "").toUpperCase();
    const esReasignacion = tipo === "REASIGNACION";

    card.innerHTML = `
        <div class="status-badge ${esReasignacion ? "reasignacion" : "asignacion"}">
            ${esReasignacion ? "Reasignación" : "Asignación"}
        </div>

        <h3>Solicitud #${s.idSolicitud}</h3>

        <div class="solicitud-details">

            <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25" />
                </svg>
                Lab: ${lab}
            </div>

            <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                     viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fecha: <span>${fechaFormateada}</span>
            </div>

            <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" 
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" 
                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 
                          9 9 0 0 1 18 0Z" />
                </svg>
                Hora: <span>${s.horaInicio} - ${s.horaFin}</span>
            </div>
        </div>

        <button class="btn-details"
            onclick="verDetalle('${s.idSolicitud}', '${s.fechaSolicitud}')">
            Más detalles
        </button>
    `;

    return card;
}

/* ---------------------------------------------
    4. Ir al detalle
------------------------------------------------*/
function verDetalle(id, fecha) {
    if (!fecha) {
        alert("Fecha inválida");
        return;
    }

    const fechaISO = new Date(fecha).toISOString();
    const fechaEncoded = encodeURIComponent(fechaISO);

    window.location.href = `/laboratorio/asignacion?id=${id}&fecha=${fechaEncoded}`;
}

const transitionContainer = document.getElementById('pageTransition');
if (transitionContainer) {
    setTimeout(() => {
        transitionContainer.classList.add('slide-out');
    }, 100);
}

/* ---------------------------------------------
    5. Menú usuario
------------------------------------------------*/
function cargarMenuUsuario() {
    const userToggle = document.getElementById("userToggle");
    const userMenu = document.getElementById("userMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    if (userToggle && userMenu) {
        userToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            userMenu.classList.toggle("show");
        });

        document.addEventListener("click", (e) => {
            if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove("show");
            }
        });
    }

    document.querySelectorAll(".dropdown-item[data-link]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const destino = btn.getAttribute("data-link");
            if (destino) {
                window.location.href = destino;
            }
        });
    });

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
