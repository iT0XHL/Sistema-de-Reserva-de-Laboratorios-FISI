document.addEventListener("DOMContentLoaded", () => {

    // ====================================================
    // 0. Animación de transición
    // ====================================================
    const transitionContainer = document.getElementById("pageTransition");
    if (transitionContainer) {
        setTimeout(() => transitionContainer.classList.add("slide-out"), 80);
    }

    // Sidebar + menú usuario
    inicializarSidebar();
    cargarMenuUsuario();

    // ====================================================
    // 1. Variables generales de la página
    // ====================================================
    let laboratorioSeleccionado = null;

    const modal            = document.getElementById("modalReasignacion");
    const modalLab         = document.getElementById("modalLab");
    const modalFecha       = document.getElementById("modalFecha");
    const modalInicio      = document.getElementById("modalInicio");
    const modalFin         = document.getElementById("modalFin");

    const btnCancelarModal = document.getElementById("btnCancelarModal");
    const btnConfirmarModal= document.getElementById("btnConfirmarModal");

    const fechaSolicitud   = document.body.getAttribute("data-fecha-solicitud"); // debe ser mismo valor que ?fecha=...
    const horaInicio       = document.body.getAttribute("data-hora-inicio");
    const horaFin          = document.body.getAttribute("data-hora-fin");
    const idSolicitud      = document.body.getAttribute("data-id-solicitud");

    const fechaBonita      = formatearFechaBonita(fechaSolicitud);

    // ====================================================
    // 2. Abrir modal al hacer click en "Asignar"
    // ====================================================
    if (modal && modalLab && modalFecha && modalInicio && modalFin) {

        document.querySelectorAll(".btn-asignar").forEach(btn => {
            btn.addEventListener("click", () => {

                laboratorioSeleccionado = btn.dataset.id;     // ej: L003
                const nombreLab = btn.dataset.nombre || "";   // opcional

                // Extraer número bonito para el modal (Lab 3, etc.)
                const ultimoNumero = extraerNumeroLab(laboratorioSeleccionado);
                const textoLab = ultimoNumero || nombreLab || laboratorioSeleccionado;

                // Resetear estilo de todos los botones
                document.querySelectorAll(".btn-asignar").forEach(b => {
                    b.style.background = "#0d6efd";
                });
                // Resaltar el seleccionado
                btn.style.background = "#0a4fc1";

                // Llenar datos en el modal
                modalLab.textContent    = textoLab;
                modalFecha.textContent  = fechaBonita;
                modalInicio.textContent = horaInicio;
                modalFin.textContent    = horaFin;

                modal.style.display = "flex";
            });
        });
    }

    // ====================================================
    // 3. Cerrar modal
    // ====================================================
    if (btnCancelarModal && modal) {
        btnCancelarModal.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // ====================================================
    // 4. Confirmar asignación (POST al backend)
    // ====================================================
    if (btnConfirmarModal) {
        btnConfirmarModal.addEventListener("click", () => {

            if (!laboratorioSeleccionado) {
                alert("Debe seleccionar un laboratorio.");
                return;
            }
            if (!idSolicitud || !fechaSolicitud) {
                console.error("Faltan datos de solicitud en <body> (data-id-solicitud / data-fecha-solicitud)");
                alert("Error interno: datos incompletos de la solicitud.");
                return;
            }

            const params = new URLSearchParams();
            params.append("id",    idSolicitud);
            params.append("fecha", fechaSolicitud);        // misma cadena que en la URL ?fecha=...
            params.append("lab",   laboratorioSeleccionado);

            fetch("/laboratorio/asignacion/confirmar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: params.toString()
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Respuesta no OK del servidor");
                }

                // Cerrar modal y redirigir a pendientes (o donde quieras)
                modal.style.display = "none";
                window.location.href = "/pendientes";
            })
            .catch(err => {
                console.error("Error al confirmar asignación:", err);
                alert("Ocurrió un error al asignar el laboratorio.");
            });

        });
    }

});

/* ========================================================
   Helpers
======================================================== */

function formatearFechaBonita(fechaStr) {
    if (!fechaStr) return "";

    // Si viene con hora "2024-11-19T10:20:00.000Z" → me quedo solo con la parte de fecha
    const soloFecha = fechaStr.split("T")[0];
    const partes = soloFecha.split("-");
    if (partes.length !== 3) return soloFecha;

    const anio = partes[0];
    const mes  = parseInt(partes[1], 10);
    const dia  = parseInt(partes[2], 10);

    const meses = ["ene", "feb", "mar", "abr", "may", "jun",
                   "jul", "ago", "sep", "oct", "nov", "dic"];

    const nombreMes = meses[mes - 1] || "";
    return `${dia} ${nombreMes} ${anio}`;
}

function extraerNumeroLab(id) {
    if (!id) return "";
    const match = id.match(/\d+$/);
    if (!match) return id;
    const numero = match[0];
    return String(parseInt(numero, 10)); // 001 → "1"
}

/* ========================================================
   SIDEBAR
======================================================== */
function inicializarSidebar() {
    const sidebar    = document.getElementById("sidebar");
    const collapseBtn= document.getElementById("collapseBtn");

    if (collapseBtn) {
        collapseBtn.addEventListener("click", () => {
            if (sidebar) {
                sidebar.classList.toggle("collapsed");
            }
        });
    }

    // Navegación de items con data-link
    document.addEventListener("click", (e) => {
        const item = e.target.closest(".menu-item[data-link], .submenu-item[data-link]");
        if (!item) return;

        const destino = item.getAttribute("data-link");
        if (destino) {
            window.location.href = destino;
        }
    });

    // Submenú "Solicitudes" (si existe)
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

/* ========================================================
   MENÚ DE USUARIO (top-right)
======================================================== */
function cargarMenuUsuario() {
    const userToggle = document.getElementById("userToggle");
    const userMenu   = document.getElementById("userMenu");
    const logoutBtn  = document.getElementById("logoutBtn");

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

    // Mi Perfil u otros enlaces del dropdown (con data-link)
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

    // Logout → /loginGestor
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                window.location.href = "/loginGestor";
            }
        });
    }

    const reqSpan = document.getElementById("reqText");
    if (reqSpan) {
        const raw = reqSpan.textContent.trim();

        // Si parece un array JSON: ["A","B","C"]
        if (raw.startsWith("[") && raw.endsWith("]")) {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    // Lo mostramos como: A, B, C
                    reqSpan.textContent = parsed.join(", ");
                }
            } catch (err) {
                console.error("No se pudo parsear requerimientos:", err);
                // si falla lo dejamos tal cual
            }
        }
    }
}
