document.addEventListener('DOMContentLoaded', function () {
    // Sidebar collapse logic
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    collapseBtn.addEventListener('click', function () {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);

        if (isCollapsed) {
            collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>';
        } else {
            collapseBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        }
    });

    // Fetch solicitudes from backend
    fetch('/api/solicitudes/mis-solicitudes')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('solicitudesContainer');
            if (!data || data.length === 0) {
                container.innerHTML = `
                    <div class="no-solicitudes">
                        No hay solicitudes
                    </div>
                `;
            } else {
                // Render the solicitudes
                data.forEach((solicitud, index) => {
                    const solicitudCard = document.createElement('div');
                    solicitudCard.classList.add('solicitud-card');
                    solicitudCard.id = `solicitud${index + 1}`;

                    solicitudCard.innerHTML = `
                        <div class="status-badge ${solicitud.estado === 'PENDIENTE' ? 'pending' : 'completed'}">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            ${solicitud.estado}
                        </div>
                        <h3>Solicitud #${index + 1}</h3>
                        <div class="solicitud-details">
                            <div class="detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                </svg>
                                Lab: ${solicitud.idLaboratorio || 'Por asignar'}
                            </div>
                            <div class="detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Fecha: ${new Date(solicitud.fechaReserva).toLocaleDateString('es-ES')}
                            </div>
                            <div class="detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Hora: ${solicitud.horaInicio} - ${solicitud.horaFin}
                            </div>
                        </div>
                        <button class="btn-details" data-id="${solicitud.idSolicitud}" data-fecha="${solicitud.fechaSolicitud}">Más detalles</button>
                    `;

                    container.appendChild(solicitudCard);
                });

                // Set up the "Más detalles" button to redirect to the detail page
                const detailsBtns = document.querySelectorAll('.btn-details');
                detailsBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const solicitudId = e.target.getAttribute('data-id');
                        const fechaSolicitud = e.target.getAttribute('data-fecha');
                        // Redirect to the detail page of the request
                        window.location.href = `/solicitudes/detalle?id=${solicitudId}&fecha=${fechaSolicitud}`;
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener las solicitudes:', error);
        });

    // Sidebar navigation logic
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // User menu logic
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

    // Logout functionality
    logoutBtn.addEventListener('click', function () {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            window.location.href = '../Login/Login.html';
        }
    });
});
