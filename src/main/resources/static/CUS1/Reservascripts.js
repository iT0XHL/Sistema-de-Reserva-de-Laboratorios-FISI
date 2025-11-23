document.addEventListener('DOMContentLoaded', function() {
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
});

document.addEventListener('DOMContentLoaded', function() {
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');

    let currentDate = new Date();
    let selectedDate = null;

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthNames = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        currentMonthElement.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const existingDays = calendarGrid.querySelectorAll('.day-cell');
        existingDays.forEach(cell => cell.remove());

        for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('day-cell', 'disabled');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day-cell');
            dayCell.textContent = day;

            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.style.fontWeight = 'bold';
            }

            dayCell.addEventListener('click', () => {
                document.querySelectorAll('.day-cell').forEach(cell => cell.classList.remove('selected'));
                dayCell.classList.add('selected');
                selectedDate = new Date(year, month, day);
                    const formattedDate = selectedDate.toISOString().split('T')[0];
                    
                    window.location.href = '/reserva2/' + formattedDate;

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

    userMenu.querySelector('[data-link="perfil.html"]').addEventListener('click', function () {
        window.location.href = ''/*Agregar ruta dps*/;
    });

    logoutBtn.addEventListener('click', function () {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            window.location.href = '../Login/Login.html';
        }
    });
});