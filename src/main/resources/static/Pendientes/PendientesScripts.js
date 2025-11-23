document.addEventListener('DOMContentLoaded', function () {

    // ----- SIDEBAR -----
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapseBtn');
    let isCollapsed = false;

    collapseBtn.addEventListener('click', function () {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);
    });

    // ----- MENÚ LATERAL (ITEMS PRINCIPALES) -----
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const destino = item.dataset.link;
            if (destino) window.location.href = destino;
        });
    });

    // ----- SUBMENÚ -----
    const submenuBtn = document.querySelector(".submenu-btn");
    const submenu = document.querySelector(".submenu");
    const arrow = document.querySelector(".arrow");

    if (submenuBtn) {
        submenuBtn.addEventListener("click", () => {
            submenu.classList.toggle("open");
            arrow.classList.toggle("open");
        });
    }

    document.querySelectorAll(".submenu-item").forEach(item => {
        item.addEventListener("click", () => {
            const link = item.dataset.link;
            if (link) window.location.href = link;
        });
    });

    // ----- TOP BAR: USUARIO -----
    const userToggle = document.getElementById('userToggle');
    const userMenu = document.getElementById('userMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    userToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        userMenu.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
        if (!userToggle.contains(e.target) && !userMenu.contains(e.target)) {
            userMenu.classList.remove('show');
        }
    });

    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Seguro que deseas cerrar sesión?')) {
            window.location.href = '/logout';
        }
    });

});
