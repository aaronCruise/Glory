
document.addEventListener('DOMContentLoaded', () => {
    fetch('/profile/UserInfo', {
    	method: 'GET',
    	credentials: 'include',  // Ensure the session cookie is sent
    })
    .then(res => {
	console.log("Raw response:", res);
    	if (!res.ok) {
            window.location.href = '/login_without_user_logged_in/index.html'; // Redirect if not logged in
    	}
    	return res.json();
    })
    .then(user => {
        document.getElementById('user-name').value = user.full_name;
        document.getElementById('full-name').value = user.full_name;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone;
        document.getElementById('shipping-address').value = user.shipping_address;
    })
    .catch(err => console.error('Error loading user info:', err));

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
    	const updatedData = {
            fullname: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            shippingAddress: document.getElementById('shipping-address').value
        };

        fetch('/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(updatedData)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.message);
            alert('Profile updated successfully!');
        })
        .catch(err => {
            console.error('Error updating profile:', err);
            alert('Error updating profile.');
    	});

    	inputs.forEach(input => input.disabled = true);
    	editbtn.style.display = 'inline-block';
    	savebtn.style.display = 'none';
    });

    // // Edit Profile Picture Event
    // const changePicBtn = document.getElementById('change-pic-btn');
    // const profileLabel = document.getElementById('profile-pic-label');
    // const profileInput = document.getElementById('profile-pic-input');

    // changePicBtn.addEventListener('click', () =>{
    //     profileLabel.style.display = 'inline-block';
    //     changePicBtn.style.display = 'none';

    //     profileInput.addEventListener('change', () => {
    //         if (profileInput.files.length > 0) {
    //             profileLabel.style.display = 'none';
    //             changePicBtn.style.display = 'inline-block';
    //         }
    //     });
    // });
});
