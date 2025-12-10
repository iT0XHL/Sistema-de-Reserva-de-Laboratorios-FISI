// SoliReasignar2scripts.js
document.addEventListener('DOMContentLoaded', function () {

    /* ==============================
       0. Transición de página
    ============================== */
    const transitionContainer = document.getElementById('pageTransition');
    if (transitionContainer) {
        setTimeout(() => transitionContainer.classList.add('slide-out'), 100);
    }

    // ==============================
    // 1. PARAMS (id + fecha nueva)
    // ==============================
    const urlParams   = new URLSearchParams(window.location.search);
    const idSolicitud = urlParams.get('id');      // 👈 MUY IMPORTANTE
    let   fechaStr    = urlParams.get('fecha');   // yyyy-MM-dd

    // Por si acaso la fecha viene en el último segmento de la URL
    if (!fechaStr || !/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
        const parts       = window.location.pathname.split('/');
        const lastSegment = parts[parts.length - 1];
        if (/^\d{4}-\d{2}-\d{2}$/.test(lastSegment)) {
            fechaStr = lastSegment;
        }
    }

    // ==============================
    // 2. FECHA SELECCIONADA
    // ==============================
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const selectedDateInput   = document.getElementById('selectedDate');

    if (fechaStr && selectedDateDisplay && selectedDateInput) {
        selectedDateInput.value = fechaStr;

        const [year, month, day] = fechaStr.split('-').map(Number);
        const dateObj    = new Date(year, month - 1, day);
        const options    = { day: 'numeric', month: 'short', year: 'numeric' };
        const formatted  = dateObj.toLocaleDateString('es-ES', options);

        selectedDateDisplay.textContent = formatted;
    }

    // Botón "Editar" → volver al calendario de reasignación
    const editDateBtn = document.getElementById('editDateBtn');
    if (editDateBtn) {
        editDateBtn.addEventListener('click', function () {
            const base = '/solicitudes/reasignar';
            const url  = idSolicitud
                ? `${base}?id=${encodeURIComponent(idSolicitud)}`
                : base;
            window.location.href = url;
        });
    }

    // ==============================
    // 3. SIDEBAR COLAPSABLE
    // ==============================
    const sidebar     = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let   isCollapsed = false;

    if (sidebar && collapseBtn) {
        collapseBtn.addEventListener('click', function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            collapseBtn.innerHTML = isCollapsed
                ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        });
    }

    // Links del sidebar
    document.querySelectorAll('.menu-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) window.location.href = destino;
        });
    });

    // ==============================
    // 4. MENÚ DE USUARIO
    // ==============================
    const userToggle = document.getElementById('userToggle');
    const userMenu   = document.getElementById('userMenu');
    const logoutBtn  = document.getElementById('logoutBtn');

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

    // Mi Perfil desde el dropdown (usa data-link en el HTML)
    document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const destino = btn.getAttribute('data-link');
            if (destino) window.location.href = destino;
        });
    });

    // Logout → loginUsuario
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                window.location.href = '/loginUsuario';
            }
        });
    }

    // ==============================
    // 5. FORMULARIO (REASIGNACIÓN)
    // ==============================
    const form = document.querySelector('.reservation-form');
    if (!form) return;

    const startTimeEl = document.getElementById('startTime');
    const endTimeEl   = document.getElementById('endTime');
    const labCountEl  = document.getElementById('labCount');
    const reqEl       = document.getElementById('requirements');

    const submitBtn = form.querySelector('.btn-submit');
    const cancelBtn = form.querySelector('.btn-cancel');

    const confirmationModal = document.getElementById('confirmationModal');
    const errorModal        = document.getElementById('errorModal');
    const successModal      = document.getElementById('successModal');

    const modalDate         = document.getElementById('modalDate');
    const modalStart        = document.getElementById('modalStart');
    const modalEnd          = document.getElementById('modalEnd');
    const modalCount        = document.getElementById('modalCount');
    const modalRequirements = document.getElementById('modalRequirements');

    const modalCancelBtn    = document.getElementById('modalCancelBtn');
    const modalConfirmBtn   = document.getElementById('modalConfirmBtn');
    const regresarBtn       = document.getElementById('regresarBtn');
    const makeAnotherBtn    = document.getElementById('makeAnotherBtn');
    const acceptBtn         = document.getElementById('acceptBtn');

    const cancelConfirmModal = document.getElementById('cancelConfirmModal');
    const cancelStayBtn      = document.getElementById('cancelStayBtn');
    const cancelGoBtn        = document.getElementById('cancelGoBtn');

    function showError(message) {
        console.error(message);
        if (errorModal) {
            const msgEl = document.getElementById('errorMessage');
            if (msgEl) msgEl.textContent = message;
            errorModal.classList.add('show');
        }
    }

    // ------------------------------
    // 5.1 Abrir modal de confirmación
    // ------------------------------
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault();

            const startVal = startTimeEl.value;
            const endVal   = endTimeEl.value;
            const countVal = labCountEl.value;
            const reqVal   = reqEl.value.trim();
            const dateText = selectedDateDisplay.textContent;

            if (!startVal || !endVal || !countVal) {
                showError('Complete todos los campos obligatorios.');
                return;
            }
            if (startVal >= endVal) {
                showError('La hora de inicio debe ser anterior a la hora de fin.');
                return;
            }

            // Validación de requerimientos (igual que en creación)
            if (reqVal.length > 0) {
                if (reqVal.includes('-')) {
                    showError('Use comas para separar los requerimientos, no guiones.');
                    return;
                }

                const formatoRequerimientos = /^\s*[^,]+(\s*,\s*[^,]+)*\s*$/;
                if (!formatoRequerimientos.test(reqVal)) {
                    showError('Formato inválido. Separe los requerimientos con comas. Ejemplo: "Python, MySQL, Oracle".');
                    return;
                }
            }

            const textoReq = reqVal.length > 0 ? reqVal : 'Sin requerimientos';

            modalDate.textContent         = dateText;
            modalStart.textContent        = startVal;
            modalEnd.textContent          = endVal;
            modalCount.textContent        = countVal;
            modalRequirements.textContent = textoReq;

            confirmationModal.classList.add('show');
        });
    }

    // Cerrar modal de confirmación
    if (modalCancelBtn && confirmationModal) {
        modalCancelBtn.addEventListener('click', function () {
            confirmationModal.classList.remove('show');
        });
    }

    // ------------------------------
    // 5.2 Confirmar y ENVIAR REASIGNACIÓN
    // ------------------------------
    if (modalConfirmBtn && confirmationModal) {
        modalConfirmBtn.addEventListener('click', function () {

            if (!idSolicitud) {
                showError('No se encontró el id de la solicitud.');
                return;
            }

            const fechaISO = selectedDateInput ? selectedDateInput.value : null;
            if (!fechaISO) {
                showError('No se pudo obtener la fecha seleccionada.');
                return;
            }

            const horaInicioStr = modalStart.textContent;
            const horaFinStr    = modalEnd.textContent;

            const horaInicioISO = new Date('1970-01-01T' + horaInicioStr + ':00').toISOString();
            const horaFinISO    = new Date('1970-01-01T' + horaFinStr   + ':00').toISOString();

            const reqRaw = reqEl.value.trim();
            const requisitosArray = reqRaw
                ? reqRaw.split(',')
                    .map(r => r.trim())
                    .filter(r => r.length > 0)
                : [];

            // (Opcional) usuario actual, por si el backend lo necesita
            const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

            const solicitudData = {
                idSolicitud: idSolicitud,              // 👈 para saber cuál actualizar
                fechaReserva: fechaISO,
                horaInicio: horaInicioISO,
                horaFin: horaFinISO,
                cantidadLaboratorios: Number(modalCount.textContent),
                requerimientos: JSON.stringify(requisitosArray),
                usuario: usuario ? usuario.idUsuario : null
            };

            // Llamada al ENDPOINT DE ACTUALIZACIÓN
            // En el backend: @PutMapping("/api/solicitudes/reasignar")
            fetch('/api/solicitudes/reasignar', {
                method: 'PUT', // o 'POST' si lo prefieres así
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(solicitudData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Respuesta no OK del servidor');
                }
                return response.json();
            })
            .then(data => {
                confirmationModal.classList.remove('show');
                setTimeout(() => successModal.classList.add('show'), 300);
            })
            .catch(error => {
                console.error(error);
                showError('Error al actualizar la solicitud.');
            });
        });
    }

    // ------------------------------
    // 5.3 Cancelar solicitud (modal de cancelar)
    // ------------------------------
    if (cancelBtn && cancelConfirmModal) {
        cancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            cancelConfirmModal.classList.add('show');
        });
    }

    if (cancelStayBtn && cancelConfirmModal) {
        cancelStayBtn.addEventListener('click', function () {
            cancelConfirmModal.classList.remove('show');
        });
    }

    if (cancelGoBtn && cancelConfirmModal) {
        cancelGoBtn.addEventListener('click', function () {
            cancelConfirmModal.classList.remove('show');
            // Vuelves a las solicitudes del usuario
            window.location.href = '/solicitudes';
        });
    }

    // Botón "Regresar" del modal de error
    if (regresarBtn && errorModal) {
        regresarBtn.addEventListener('click', function () {
            errorModal.classList.remove('show');
        });
    }

    // En éxito: "Hacer otra reserva" o "Aceptar"
    if (makeAnotherBtn) {
        makeAnotherBtn.addEventListener('click', function () {
            window.location.href = '/reserva';
        });
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            window.location.href = '/solicitudes';
        });
    }

    document.querySelectorAll(".btn-details").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const id    = this.getAttribute("data-id");
            const fecha = this.getAttribute("data-fecha");

            if (!id || !fecha) {
                console.error("Error: id o fecha vacíos en breadcrumb:", id, fecha);
                return;
            }

            const url = `/solicitudes/detalle?id=${encodeURIComponent(id)}&fecha=${encodeURIComponent(fecha)}`;
            window.location.href = url;
        });
    });
});
