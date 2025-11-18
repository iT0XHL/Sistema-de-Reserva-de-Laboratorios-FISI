function togglePasswordVisibility() {
    const passwordField = document.getElementById('password');
    const eyeIcon = document.querySelector('.password-toggle svg');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        //Ojito cerrao
        eyeIcon.innerHTML = '<path d="M17.293 13.293A8 8 0 016.707 2.707l10.586 10.586z"></path><path d="M1 1l22 22"></path><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>';
    } else {
        passwordField.type = 'password';
        //Ojito abiertado
        eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === '' || password === '') {
        showModal();
    } else {
        window.location.href = '../Pagina Principal/Index.html';
    }
}

function showModal() {
    document.getElementById('errorModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('errorModal').style.display = 'none';
}