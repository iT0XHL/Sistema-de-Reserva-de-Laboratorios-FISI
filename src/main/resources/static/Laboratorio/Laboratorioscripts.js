document.addEventListener("DOMContentLoaded", () => {
    inicializarSidebar();
    cargarSolicitudesPendientesSinLaboratorio(); 
    cargarMenuUsuario();
});

/* ---------------------------------------------
   🔹 1. Sidebar
------------------------------------------------*/
function inicializarSidebar() {
    const sidebar = document.getElementById("sidebar");
    const collapseBtn = document.getElementById("collapseBtn");
    let isCollapsed = false;

    collapseBtn.addEventListener("click", () => {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle("collapsed", isCollapsed);
    });

    document.querySelectorAll(".menu-item").forEach((item) => {
        const destino = item.dataset.link;
        if (destino) item.addEventListener("click", () => window.location.href = destino);
    });
}

/* ---------------------------------------------
   🔹 2. Cargar SOLO solicitudes SIN laboratorio
------------------------------------------------*/
async function cargarSolicitudesPendientesSinLaboratorio() {
    const contenedor = document.getElementById("solicitudesContainer");

    try {
        const resp = await fetch("/api/solicitudes/pendiente-laboratorio");
        const solicitudes = await resp.json();

        if (!solicitudes.length) {
            contenedor.innerHTML = `
                <div class="no-solicitudes">No hay solicitudes pendientes por asignar laboratorio</div>
            `;
            return;
        }

        // Render de cada tarjeta
        solicitudes.forEach(s => {
            contenedor.appendChild(crearTarjetaSolicitud(s));
        });

    } catch (e) {
        contenedor.innerHTML = "<div class='no-solicitudes'>Error cargando datos</div>";
        console.error("Error:", e);
    }
}

/* ---------------------------------------------
   🔹 3. Crear tarjeta con TU HTML dado
------------------------------------------------*/
function crearTarjetaSolicitud(s) {

    const card = document.createElement("div");
    card.classList.add("solicitud-card");

    card.innerHTML = `
        <div class="status-badge pending">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>  
            Pendiente
        </div>

        <h3>Solicitud #${s.idSolicitud}</h3>

        <div class="solicitud-details">
            <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                </svg>
                Lab: Por asignar
            </div>

            <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Fecha: <span>${s.fechaSolicitud}</span>
            </div>

            <div class="detail-item">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Hora: <span>${s.horaInicio} - ${s.horaFin}</span>
            </div>
        </div>

        <button class="btn-details">Más detalles</button>
    `;

    return card;
}

/* ---------------------------------------------
   🔹 4. Menú usuario
------------------------------------------------*/
function cargarMenuUsuario() {
    const userToggle = document.getElementById("userToggle");
    const userMenu = document.getElementById("userMenu");
    const logoutBtn = document.getElementById("logoutBtn");

    userToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        userMenu.classList.toggle("show");
    });

    document.addEventListener("click", () => userMenu.classList.remove("show"));

    logoutBtn.addEventListener("click", () => {
        if (confirm("¿Seguro que deseas cerrar sesión?")) {
            window.location.href = "/logout";
        }
    });
}
