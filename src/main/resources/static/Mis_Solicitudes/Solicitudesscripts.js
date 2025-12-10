document.addEventListener('DOMContentLoaded', function () {

    // ==========================
    // 0. Transición de página
    // ==========================
    const transitionContainer = document.getElementById('pageTransition');
    if (transitionContainer) {
        setTimeout(() => {
            transitionContainer.classList.add('slide-out');
        }, 100);
    }

    // ==========================
    // 1. Sidebar (colapsar)
    // ==========================
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', function () {
            isCollapsed = !isCollapsed;
            sidebar.classList.toggle('collapsed', isCollapsed);

            collapseBtn.innerHTML = isCollapsed
                ? '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" /></svg>';
        });
    }

    // Navegación del sidebar
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function () {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // ==========================
    // 2. Menú de usuario (topbar)
    // ==========================
    document.querySelectorAll('.dropdown-item[data-link]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const destino = btn.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

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

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('¿Seguro que deseas cerrar sesión?')) {
                window.location.href = '/loginUsuario';
            }
        });
    }

    // ==========================
    // 3. Filtros + listado
    // ==========================
    const container     = document.getElementById('solicitudesContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');
    let solicitudesOriginales = [];

    function aplicarFiltro(filtro) {
        let lista = solicitudesOriginales;

        if (filtro !== 'TODAS') {
            const filtroUpper = filtro.toUpperCase();
            lista = solicitudesOriginales.filter(s => {
                const estado = (s.estado || '').toUpperCase();
                return estado === filtroUpper;
            });
        }

        renderSolicitudes(lista);
    }

    function renderSolicitudes(lista) {
        if (!container) return;

        container.innerHTML = '';

        if (!lista || lista.length === 0) {
            container.innerHTML = `
                <div class="no-solicitudes">
                    No hay solicitudes.
                </div>
            `;
            return;
        }

        lista.forEach((solicitud, index) => {
            const card = document.createElement('div');
            card.classList.add('solicitud-card');
            card.id = `solicitud${index + 1}`;

            // ------------------ Estado + icono ------------------
            let estadoClass = 'pending';
            let iconoSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            `;

            const estado = (solicitud.estado || '').toUpperCase();

            if (estado === 'ACEPTADA') {
                estadoClass = 'accepted';
                iconoSVG = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                `;
            } else if (estado === 'RECHAZADA') {
                estadoClass = 'rejected';
                iconoSVG = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                `;
            }

            // ------------------ Tipo de solicitud ------------------
            const tipoUpper = (solicitud.tipo || 'ASIGNACION').toUpperCase();
            let iconTipoSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12h6m-3-3v6m-6 7.5h12A2.25 2.25 0 0020.25 20V7.5
                             L15 2.25H6A2.25 2.25 0 003.75 4.5v15A2.25 2.25 0 006 21z" />
                </svg>
            `;
            let textoTipo = 'Asignación';

            if (tipoUpper === 'REASIGNACION') {
                iconTipoSVG = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                         viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M4.5 4.5v6h6M19.5 19.5v-6h-6M5.25 19.5A8.25 8.25 0 0 0 18 9.75h1.5M6 14.25A8.25 8.25 0 0 1 18.75 4.5H17.25" />
                    </svg>
                `;
                textoTipo = 'Reasignación';
            }

            const fechaMostrar = solicitud.fechaReserva
                ? new Date(solicitud.fechaReserva).toLocaleDateString('es-ES')
                : 'Sin fecha';

            card.innerHTML = `
                <div class="status-badge ${estadoClass}">
                    ${iconoSVG}
                    ${solicitud.estado || 'PENDIENTE'}
                </div>

                <h3>Solicitud ${solicitud.idSolicitud}</h3>

                <div class="solicitud-details">
                    <!-- Tipo de solicitud -->
                    <div class="detail-item">
                        ${iconTipoSVG}
                        Tipo de solicitud: ${textoTipo}
                    </div>

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
                        Fecha: ${fechaMostrar}
                    </div>

                    <div class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        Hora: ${solicitud.horaInicio} - ${solicitud.horaFin}
                    </div>
                </div>

                <div class="actions-row">
                    <button class="btn-details"
                            data-id="${solicitud.idSolicitud}"
                            data-fecha="${solicitud.fechaSolicitud}">
                        Más detalles
                    </button>

                    ${estado === 'RECHAZADA' ? `
                        <button class="btn-report"
                                data-id="${solicitud.idSolicitud}"
                                data-fecha="${solicitud.fechaSolicitud}">
                            Reporte
                        </button>
                    ` : ''}
                </div>
            `;

            container.appendChild(card);
        });

        // Botones "Más detalles"
        container.querySelectorAll('.btn-details').forEach(btn => {
            btn.addEventListener('click', () => {
                const solicitudId    = btn.getAttribute('data-id');
                const fechaSolicitud = btn.getAttribute('data-fecha');
                window.location.href = `/solicitudes/detalle?id=${solicitudId}&fecha=${fechaSolicitud}`;
            });
        });

        // Botones "Reporte" (solo rechazadas)
        container.querySelectorAll('.btn-report').forEach(btn => {
            btn.addEventListener('click', () => {
                const id    = btn.getAttribute('data-id');
                let   fecha = btn.getAttribute('data-fecha') || '';

                fecha = fecha.replace(/ /g, '+');

                // Usuario:
                window.location.href = `/misolicitud/reporte?id=${id}&fecha=${fecha}`;
            });
        });
    }

    // Listeners de los botones de filtro
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtro = btn.getAttribute('data-filter') || 'TODAS';
            aplicarFiltro(filtro);
        });
    });

    // ==========================
    // 4. Fetch de solicitudes
    // ==========================
    fetch('/api/solicitudes/mis-solicitudes')
        .then(response => response.json())
        .then(data => {
            solicitudesOriginales = data || [];
            aplicarFiltro('TODAS');   // mostrar todas por defecto
        })
        .catch(error => {
            console.error('Error al obtener las solicitudes:', error);
            if (container) {
                container.innerHTML = '<div class="no-solicitudes">Error al cargar datos</div>';
            }
        });

});
