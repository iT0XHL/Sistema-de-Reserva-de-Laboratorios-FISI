// Sidebar collapse
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    collapseBtn.addEventListener('click', function() {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);

        if (isCollapsed) {
            collapseBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5"/></svg>';
        } else {
            collapseBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5"/></svg>';
        }
    });

    // Sidebar navigation  ✅ AHORA DENTRO DE DOMContentLoaded
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    // Access buttons  ✅ AHORA DENTRO DE DOMContentLoaded
    document.querySelectorAll('.access-button').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.getAttribute('data-link');
            if (destino) {
                window.location.href = destino;
            }
        });
    });

    document.querySelectorAll(".btn-details").forEach(btn => {

        btn.addEventListener("click", function () {

            const id = this.getAttribute("data-id");
            const fecha = this.getAttribute("data-fecha");

            if (!id || !fecha) {
                console.error("Error: id o fecha vacíos:", id, fecha);
                return;
            }

            // Redirige usando tu endpoint real
            window.location.href = `/solicitudes/detalle?id=${id}&fecha=${fecha}`;
        });
    });
});

// User dropdown
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

    logoutBtn.addEventListener('click', function () {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            window.location.href = '/login';
        }
    });
});
