import {initHeader} from '../shared_elements/initialize_header.js'
fetch('../shared_elements/header_logged_in.html')
.then(res => res.text())
.then(data => {
    document.getElementById('header').innerHTML = data;
    initHeader();

    const isAdmin = localStorage.getItem("role") === "admin";
    if (!isAdmin) {
        document.querySelector('[a href="../admin/index.html"]').style.display = "none";
    }
});
