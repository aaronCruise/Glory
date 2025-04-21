document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    navbarToggle.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // Continue shopping button handler
    document.querySelector('.continue-shopping').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../shop_without_user_logged_in/index.html';
    });
});
