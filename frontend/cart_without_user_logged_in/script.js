document.addEventListener('DOMContentLoaded', function() {
    // Continue shopping button handler
    document.querySelector('.continue-shopping').addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../shop_without_user_logged_in/index.html';
    });
});
