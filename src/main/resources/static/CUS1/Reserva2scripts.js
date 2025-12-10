document.addEventListener('DOMContentLoaded', function() {
    const transitionContainer = document.getElementById('pageTransition');
    
    // Pequeño timeout para asegurar que el navegador renderice el estado inicial antes de animar
    setTimeout(() => {
        if (transitionContainer) {
            transitionContainer.classList.add('slide-out');
        }
    }, 100);
});

document.addEventListener('DOMContentLoaded', function () {

    // ==============================
    // 1. FECHA SELECCIONADA
    // ==============================
    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const selectedDateInput = document.getElementById('selectedDate');
    let fechaStr = null;

    // 1.1. Intentar leer ?fecha=YYYY-MM-DD
    const params = new URLSearchParams(window.location.search);
    const fechaParam = params.get('fecha');
    if (fechaParam && /^\d{4}-\d{2}-\d{2}$/.test(fechaParam)) {
        fechaStr = fechaParam;
    }

    // 1.2. Si no hay query param, tomar último segmento de la URL: /reserva2/2025-11-19
    if (!fechaStr) {
        const parts = window.location.pathname.split('/');
        const lastSegment = parts[parts.length - 1];
        if (/^\d{4}-\d{2}-\d{2}$/.test(lastSegment)) {
            fechaStr = lastSegment;
        }
    }

    // 1.3. Si encontramos una fecha válida, la mostramos
    if (fechaStr && selectedDateDisplay && selectedDateInput) {
        selectedDateInput.value = fechaStr;
        const [year, month, day] = fechaStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day); // evita problemas de zona horaria
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        const formatted = dateObj.toLocaleDateString('es-ES', options); // ej: "19 nov 2025"
        selectedDateDisplay.textContent = formatted;
    }

    // Botón "Editar" -> volver al calendario
    const editDateBtn = document.getElementById('editDateBtn');
    if (editDateBtn) {
        editDateBtn.addEventListener('click', function () {
            window.location.href = '/reserva';
        });
    }

    // ==============================
    // 2. SIDEBAR COLAPSABLE
    // ==============================
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    if (sidebar && collapseBtn) {
        collapseBtn.addEventListener('click', function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            collapseBtn.innerHTML = isCollapsed
                ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        });
    }

    // Navegación de items del sidebar
    document.querySelectorAll('.menu-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) window.location.href = destino;
        });
    });

    // ==============================
    // MENÚ DE USUARIO
    // ==============================
    const userToggle = document.getElementById('userToggle');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');

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

    // ==================================================================
    // LOGOUT FUNCTIONALITY
    // ==================================================================
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm("¿Seguro que deseas cerrar sesión?")) {
                window.location.href = "/loginUsuario";
            }
        });
    }

    // ==============================
    // 4. FORMULARIO Y CREACIÓN DE SOLICITUD
    // ==============================
    const form = document.querySelector('.reservation-form');
    if (!form) return;

    const startTimeEl = document.getElementById('startTime');
    const endTimeEl = document.getElementById('endTime');
    const labCountEl = document.getElementById('labCount');
    const reqEl = document.getElementById('requirements');

    const submitBtn = form.querySelector('.btn-submit');
    const cancelBtn = form.querySelector('.btn-cancel');

    const confirmationModal = document.getElementById('confirmationModal');
    const errorModal = document.getElementById('errorModal');
    const successModal = document.getElementById('successModal');

    const modalDate = document.getElementById('modalDate');
    const modalStart = document.getElementById('modalStart');
    const modalEnd = document.getElementById('modalEnd');
    const modalCount = document.getElementById('modalCount');
    const modalRequirements = document.getElementById('modalRequirements');

    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const regresarBtn = document.getElementById('regresarBtn');
    const makeAnotherBtn = document.getElementById('makeAnotherBtn');
    const acceptBtn = document.getElementById('acceptBtn');

    // Modal de confirmación de cancelación
    const cancelConfirmModal = document.getElementById('cancelConfirmModal');
    const cancelStayBtn = document.getElementById('cancelStayBtn'); // botón "No"
    const cancelGoBtn = document.getElementById('cancelGoBtn');     // botón "Sí"

    function showError(message) {
    console.error(message);
    if (errorModal) {
        const msgEl = document.getElementById('errorMessage');
        if (msgEl) {
            msgEl.textContent = message;
        }
        errorModal.classList.add('show');
    }
}
document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
    btn.addEventListener('click', () => {
        const destino = btn.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});

    // Abrir modal de confirmación de datos
    if (submitBtn) {
    submitBtn.addEventListener('click', function (e) {
        e.preventDefault();

        const startVal = startTimeEl.value;
        const endVal = endTimeEl.value;
        const countVal = labCountEl.value;
        const reqVal = reqEl.value.trim();   // 👈 texto limpio
        const dateText = selectedDateDisplay.textContent;

        // Validaciones básicas
        if (!startVal || !endVal || !countVal) {
            showError('Complete todos los campos obligatorios.');
            return;
        }
        if (startVal >= endVal) {
            showError('La hora de inicio debe ser anterior a la hora de fin.');
            return;
        }

        // 🔴 VALIDACIÓN DE REQUERIMIENTOS

        // 1) Si el usuario escribió algo, validamos formato.
        if (reqVal.length > 0) {

            // No se permiten guiones como separador
            if (reqVal.includes('-')) {
                showError('Use comas para separar los requerimientos, no guiones.');
                return;
            }

            // Formato permitido:
            //   "Item1"
            //   "Item1, Item2"
            //   "Item1,Item2, Item3"
            const formatoRequerimientos = /^\s*[^,]+(\s*,\s*[^,]+)*\s*$/;

            if (!formatoRequerimientos.test(reqVal)) {
                showError('Formato inválido. Separe los requerimientos con comas. Ejemplo: "Python, MySQL, Oracle".');
                return;
            }
        }

        // Si está vacío, lo mostramos como "Sin requerimientos" en el modal
        const textoReq = reqVal.length > 0 ? reqVal : 'Sin requerimientos';

        // Llenar el modal de confirmación
        modalDate.textContent = dateText;
        modalStart.textContent = startVal;
        modalEnd.textContent = endVal;
        modalCount.textContent = countVal;
        modalRequirements.textContent = textoReq;

        confirmationModal.classList.add('show');
    });
}


    // Cerrar modal de confirmación con el botón "Cancelar"
    if (modalCancelBtn && confirmationModal) {
        modalCancelBtn.addEventListener('click', function () {
            confirmationModal.classList.remove('show');
        });
    }

    // Enviar solicitud al backend al confirmar
if (modalConfirmBtn && confirmationModal) {
    modalConfirmBtn.addEventListener('click', function () {

        // Fecha en formato ISO (yyyy-MM-dd) desde el input oculto
        const fechaISO = selectedDateInput ? selectedDateInput.value : null;
        if (!fechaISO) {
            showError('No se pudo obtener la fecha seleccionada.');
            return;
        }

        // Tomamos las horas del modal
        const horaInicioStr = modalStart.textContent; // "08:00"
        const horaFinStr   = modalEnd.textContent;   // "10:00"

        // Convertir las horas a formato ISO que pueda leer java.util.Date
        const horaInicioISO = new Date('1970-01-01T' + horaInicioStr + ':00').toISOString();
        const horaFinISO    = new Date('1970-01-01T' + horaFinStr   + ':00').toISOString();

        // Obtener el usuario actual (localStorage)
        const usuario = JSON.parse(localStorage.getItem('usuario'));

        if (!usuario) {
            showError('El usuario no está autenticado.');
            return;
        }
const reqRaw = reqEl.value.trim();

const requisitosArray = reqRaw
  ? reqRaw.split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0)
  : [];

        // Recopilar los datos del formulario
        const solicitudData = {
    fechaReserva: fechaISO,
    horaInicio: horaInicioISO,
    horaFin: horaFinISO,
    cantidadLaboratorios: modalCount.textContent,
    requerimientos: JSON.stringify(requisitosArray), // 👈 si en Java usas String
    usuario: usuario.idUsuario
};

        // Enviar datos al backend usando fetch
        fetch('/api/solicitudes/crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(solicitudData),
        })
        .then(response => response.json())
        .then(data => {
            // Si la solicitud fue exitosa
            if (data && data.idSolicitud) {
                confirmationModal.classList.remove('show');
                setTimeout(() => successModal.classList.add('show'), 300);
            } else {
                showError('Error al enviar la solicitud.');
            }
        })
        .catch(error => {
            showError('Error al enviar la solicitud.');
            console.error('Error:', error);
        });
    });
}


    // Abrir modal al pulsar "Cancelar solicitud"
    if (cancelBtn && cancelConfirmModal) {
        cancelBtn.addEventListener('click', function (e) {
            e.preventDefault();
            cancelConfirmModal.classList.add('show');
        });
    }

    // Botón "No" -> solo cerrar el modal de cancelar
    if (cancelStayBtn && cancelConfirmModal) {
        cancelStayBtn.addEventListener('click', function () {
            cancelConfirmModal.classList.remove('show');
        });
    }

    // Botón "Sí" -> cerrar y redirigir (o limpiar el formulario)
    if (cancelGoBtn && cancelConfirmModal) {
        cancelGoBtn.addEventListener('click', function () {
            cancelConfirmModal.classList.remove('show');
            window.location.href = '/reserva';
            // o form.reset();
        });
    }

    // Botón "Regresar" del modal de error
    if (regresarBtn && errorModal) {
        regresarBtn.addEventListener('click', function () {
            errorModal.classList.remove('show');
        });
    }

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
});
