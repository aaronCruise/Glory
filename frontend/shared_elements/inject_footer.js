fetch('../shared_elements/footer_logged_in.html')
.then(res => res.text())
.then(data => {
    document.getElementById('footer').innerHTML = data;
});