document.addEventListener('DOMContentLoaded', function() {
    const transitionContainer = document.getElementById('pageTransition');
    
    // Transición
    setTimeout(() => {
        if (transitionContainer) {
            transitionContainer.classList.add('slide-out');
        }
    }, 100);
});

document.addEventListener('DOMContentLoaded', function () {
    // ==================================================================
    // 1. SIDEBAR COLLAPSE LOGIC
    // ==================================================================
    const sidebar     = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed   = false;

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            collapseBtn.innerHTML = isCollapsed
                ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        });
    }

    // Ir a /perfil desde menú
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

    // ==================================================================
    // 2. FETCH SOLICITUDES (SOLO ACEPTADAS)
    // ==================================================================
    fetch('/api/solicitudes/mis-solicitudes')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('solicitudesContainer');
            container.innerHTML = ''; // Limpiar contenedor

            // --- FILTRO: SOLO ACEPTADAS ---
            const solicitudesAceptadas = data.filter(solicitud =>
                solicitud.estado && solicitud.estado.toUpperCase() === 'ACEPTADA'
            );

            if (!solicitudesAceptadas || solicitudesAceptadas.length === 0) {
                container.innerHTML = `
                    <div class="no-solicitudes">
                        No tienes reservas aceptadas por el momento.
                    </div>
                `;
            } else {

                // Iconos para tipo
                const iconTipoAsignacion = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M9 12h6m-3-3v6m-6 7.5h12A2.25 2.25 0 0020.25 20V7.5
                                 L15 2.25H6A2.25 2.25 0 003.75 4.5v15A2.25 2.25 0 006 21z" />
                    </svg>
                `;

                const iconTipoReasignacion = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M4.5 4.5v6h6M19.5 19.5v-6h-6M5.25 19.5A8.25 8.25 0 0 0 18 9.75h1.5M6 14.25A8.25 8.25 0 0 1 18.75 4.5H17.25" />
                    </svg>
                `;

                solicitudesAceptadas.forEach((solicitud, index) => {
                    const solicitudCard = document.createElement('div');
                    solicitudCard.classList.add('solicitud-card');
                    solicitudCard.id = `solicitud${index + 1}`;

                    // Estilos fijos para ACEPTADA
                    const estadoClass = 'accepted';
                    const iconoSVG = `
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="M4.5 12.75l6 6 9-13.5" />
                        </svg>`;

                    // Fecha corregida
                    const fechaMostrar = new Date(solicitud.fechaReserva)
                        .toLocaleDateString('es-ES', { timeZone: 'UTC' });

                    // Tipo de solicitud
                    const tipoRaw   = (solicitud.tipo || '').toUpperCase();
                    const esReasig  = tipoRaw === 'REASIGNACION';
                    const tipoLabel = esReasig ? 'Reasignación' : 'Asignación';
                    const iconTipo  = esReasig ? iconTipoReasignacion : iconTipoAsignacion;

                    solicitudCard.innerHTML = `
                        <div class="status-badge ${estadoClass}">
                            ${iconoSVG}
                            ${solicitud.estado}
                        </div>

                        <h3>
                            Reserva Confirmada #${index + 1} – ID: ${solicitud.idSolicitud}
                        </h3>

                        <div class="solicitud-details">

                            <div class="detail-item">
                                ${iconTipo}
                                Tipo: ${tipoLabel}
                            </div>

                            <div class="detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke-width="1.5"
                                     stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
                                </svg>
                                Lab: ${solicitud.idLaboratorio || 'No asignado'}
                            </div>

                            <div class="detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Fecha: ${fechaMostrar}
                            </div>

                            <div class="detail-item">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                     viewBox="0 0 24 24" stroke-width="1.5"
                                     stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Hora: ${solicitud.horaInicio} - ${solicitud.horaFin}
                            </div>
                        </div>

                        <button class="btn-details"
                                data-id="${solicitud.idSolicitud}"
                                data-fecha="${solicitud.fechaSolicitud}">
                            Ver detalles
                        </button>
                    `;
                    container.appendChild(solicitudCard);
                });

                // Lógica botones "Ver detalles"
                const detailsBtns = document.querySelectorAll('.btn-details');
                detailsBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const solicitudId    = e.target.getAttribute('data-id');
                        const fechaSolicitud = e.target.getAttribute('data-fecha');
                        window.location.href = `/solicitudes/detalle?id=${solicitudId}&fecha=${fechaSolicitud}`;
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error al obtener las solicitudes:', error);
            const container = document.getElementById('solicitudesContainer');
            if (container) {
                container.innerHTML = '<div class="no-solicitudes">Error al cargar datos</div>';
            }
        });

    // ==================================================================
    // 3. SIDEBAR NAVIGATION
    // ==================================================================
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // ==================================================================
    // 4. USER MENU LOGIC
    // ==================================================================
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

    // ==================================================================
    // 5. LOGOUT FUNCTIONALITY
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
});
