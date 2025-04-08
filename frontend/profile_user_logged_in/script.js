window.addEventListener('DOMContentLoaded', () => {
    // Make sure the user is logged in before doing anything else on the page
    const token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login page if the user is not logged in
        console.log('No token found. User not logged in.');
        window.location.replace('../login_without_user_logged_in');
    }

    fetch("http://128.6.60.9:8080/profile", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
    })
    .then(data => {
        document.getElementById("fullName").value = data.name;
        document.getElementById("email").value = data.email;
        document.getElementById("phone").value = data.phone;
        document.getElementById("shipping-address").value = data.address;

        if (data.profilePicUrl) {
            document.getElementById("profile-pic").src = data.profilePicUrl;
        }
    })
    .catch(err => {
        console.log('Error fetching profile:', err);
        window.location.replace('../login_without_user_logged_in');
    })


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
});