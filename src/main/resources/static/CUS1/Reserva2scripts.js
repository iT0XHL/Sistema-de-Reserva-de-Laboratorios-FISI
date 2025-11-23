document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const fechaParam = urlParams.get('fecha');

    const selectedDateDisplay = document.getElementById('selectedDateDisplay');
    const selectedDateInput = document.getElementById('selectedDate');

    if (fechaParam) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(fechaParam)) {
            selectedDateInput.value = fechaParam;

            const dateObj = new Date(fechaParam);
            if (!isNaN(dateObj.getTime())) {
                const options = { day: 'numeric', month: 'short', year: 'numeric' };
                const formatted = dateObj.toLocaleDateString('es-ES', options);
                selectedDateDisplay.textContent = formatted;
            }
        }
    }

    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    collapseBtn.addEventListener('click', function() {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);

        if (isCollapsed) {
            collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>';
        } else {
            collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        }
    });

    const editDateBtn = document.getElementById('editDateBtn');
    if (editDateBtn) {
        editDateBtn.addEventListener('click', function() {
            window.location.href = '/reserva';
        });
    }

    const form = document.querySelector('.reservation-form');
    if (form) {


    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();

        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const labCount = document.getElementById('labCount').value;
        const requirements = document.getElementById('requirements').value || 'Sin requerimientos';
        const selectedDateText = selectedDateDisplay.textContent;

        if (!startTime || !endTime || !labCount) {
            showErrorMessage("Complete todos los campos obligatorios.");
            return;
        }
        if (startTime >= endTime) {
            showErrorMessage("La hora de inicio debe ser anterior a la hora de fin.");
            return;
        }

        document.getElementById('modalDate').textContent = selectedDateText;
        document.getElementById('modalStart').textContent = startTime;
        document.getElementById('modalEnd').textContent = endTime;
        document.getElementById('modalCount').textContent = labCount;
        document.getElementById('modalRequirements').textContent = requirements;
        
        document.getElementById('confirmationModal').classList.add('show');
    });
}

    function showErrorMessage(message) {
    document.getElementById('errorModal').classList.add('show');
    }

    document.getElementById('regresarBtn').addEventListener('click', function() {
        document.getElementById('errorModal').classList.remove('show');
    });

    function closeModal() {
        const modal = document.getElementById('confirmationModal');
        modal.classList.remove('show');
    }

    document.getElementById('modalCancelBtn').addEventListener('click', closeModal);
    
    document.getElementById('modalConfirmBtn').addEventListener('click', function() {
    
        const lastReservation = {
        fecha: document.getElementById('modalDate').textContent,
        inicio: document.getElementById('modalStart').textContent,
        fin: document.getElementById('modalEnd').textContent
        };
        localStorage.setItem('lastReservation', JSON.stringify(lastReservation));

        document.getElementById('confirmationModal').classList.remove('show');

        setTimeout(() => {
            document.getElementById('successModal').classList.add('show');
        }, 300);
    });
    }
    
});

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const destino = item.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
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

    const perfilBtn = userMenu.querySelector('[data-link="perfil.html"]');
    if (perfilBtn) {
        perfilBtn.addEventListener('click', function () {
            window.location.href = ''/*Poner ruta dps*/;
        });
    }

    logoutBtn.addEventListener('click', function () {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            window.location.href = '/login';
        }
    });
});

const cancelBtn = document.querySelector('.btn-cancel');
if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
        window.location.href = '/index';
    });
}

document.getElementById('makeAnotherBtn').addEventListener('click', function() {
    window.location.href = '/reserva';
});

document.getElementById('acceptBtn').addEventListener('click', function() {
    window.location.href = '/solicitudes';
});