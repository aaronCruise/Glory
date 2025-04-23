fetch('../shared_elements/footer_logged_out.html')
.then(res => res.text())
.then(data => {
    document.getElementById('footer').innerHTML = data;
});