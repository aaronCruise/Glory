
document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector("#mobile-menu")
    const menuLinks = document.querySelector(".navbar-menu")

    menu.addEventListener("click", function () {
        menu.classList.toggle("is-active");
        menuLinks.classList.toggle("active");
    });

    // Edit Profile Info Event
    const editbtn = document.getElementById('edit-btn');
    const savebtn = document.getElementById('save-btn');
    const inputs = document.querySelectorAll('#profile-form input');

    editbtn.addEventListener('click', () => {
        inputs.forEach(input => input.disabled = false);
        editbtn.style.display = 'none';
        savebtn.style.display = 'inline-block';
    });

    // Save Profile Info Event
    savebtn.addEventListener('click', () => {
        inputs.forEach(input => input.disabled = true);
        editbtn.style.display = 'inline-block';
        savebtn.style.display = 'none';
    });

    // Edit Profile Picture Event
    const changePicBtn = document.getElementById('change-pic-btn');
    const profileLabel = document.getElementById('profile-pic-label');
    const profileInput = document.getElementById('profile-pic-input');

    changePicBtn.addEventListener('click', () =>{
        profileLabel.style.display = 'inline-block';
        changePicBtn.style.display = 'none';

        profileInput.addEventListener('change', () => {
            if (profileInput.files.length > 0) {
                profileLabel.style.display = 'none';
                changePicBtn.style.display = 'inline-block';
            }
        });
    });

});