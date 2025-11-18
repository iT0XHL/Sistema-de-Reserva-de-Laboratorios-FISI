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

document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const destino = item.getAttribute('data-link');
        if (destino) {
            window.location.href = destino;
        }
    });
});

document.querySelectorAll('.access-button').forEach(item => {
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