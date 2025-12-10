document.addEventListener('DOMContentLoaded', function () {

    /* ==============================
       0. Transición de página
    ============================== */
    const transitionContainer = document.getElementById('pageTransition');

    if (transitionContainer) {
        setTimeout(() => {
            transitionContainer.classList.add('slide-out');
        }, 100);

        transitionContainer.addEventListener('transitionend', (e) => {
            if (e.target.classList.contains('transition-bar')) {
                transitionContainer.style.display = 'none';
            }
        });
    }

    /* ==============================
       1. Sidebar (colapsar + links)
    ============================== */
    const sidebar     = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed   = false;

    if (sidebar && collapseBtn) {
        collapseBtn.addEventListener('click', function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            collapseBtn.innerHTML = isCollapsed
                ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        });
    }

    document.querySelectorAll('.menu-item[data-link]').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    /* ==============================
       2. Calendario
    ============================== */
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid        = document.getElementById('calendarGrid');
    const prevMonthButton     = document.getElementById('prevMonth');
    const nextMonthButton     = document.getElementById('nextMonth');

    // 👉 tomamos el id de la solicitud (input hidden)
    const solicitudIdInput = document.getElementById('solicitudId');
    const solicitudId      = solicitudIdInput ? solicitudIdInput.value : null;

    if (currentMonthElement && calendarGrid && prevMonthButton && nextMonthButton) {

        let currentDate  = new Date();
        let selectedDate = null;

        function renderCalendar(date) {
            const year  = date.getFullYear();
            const month = date.getMonth();

            const monthNames = [
                'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
            currentMonthElement.textContent = `${monthNames[month]} ${year}`;

            const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = domingo
            const daysInMonth     = new Date(year, month + 1, 0).getDate();

            // Limpiar días anteriores
            calendarGrid.querySelectorAll('.day-cell').forEach(cell => cell.remove());

            // Huecos hasta el primer día (empezando lunes)
            const blanks = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1);
            for (let i = 0; i < blanks; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.classList.add('day-cell', 'disabled');
                calendarGrid.appendChild(emptyCell);
            }

            // Días del mes
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = document.createElement('div');
                dayCell.classList.add('day-cell');
                dayCell.textContent = day;

                const today = new Date();
                if (
                    year  === today.getFullYear() &&
                    month === today.getMonth() &&
                    day   === today.getDate()
                ) {
                    dayCell.style.fontWeight = 'bold';
                }

                dayCell.addEventListener('click', () => {
                    document.querySelectorAll('.day-cell').forEach(cell => cell.classList.remove('selected'));
                    dayCell.classList.add('selected');

                    selectedDate = new Date(year, month, day);
                    const formattedDate = selectedDate.toISOString().split('T')[0]; // yyyy-MM-dd

                    // Armamos los parámetros para la siguiente pantalla
                    const params = new URLSearchParams();
                    if (solicitudId) params.append('id', solicitudId);
                    params.append('fecha', formattedDate);

                    // Redirigir a SoliReasignar2
                    window.location.href = '/solicitudes/reasignar2?' + params.toString();
                });

                calendarGrid.appendChild(dayCell);
            }
        }

        prevMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });

        nextMonthButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });

        renderCalendar(currentDate);
    }

    /* ==============================
       3. Menú de usuario (top-right)
    ============================== */
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

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                window.location.href = '/loginUsuario';
            }
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
