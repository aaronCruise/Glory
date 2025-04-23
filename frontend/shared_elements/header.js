import {initHeader} from './header.js'
fetch('./header_logged_in.html')
.then(res => res.text())
.then(data => {document.getElementById('header').innerHTML = data;});
initHeader();