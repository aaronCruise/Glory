document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const form = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const requirementsList = document.querySelectorAll('.requirement');

    // Password validation patterns
    const patterns = {
        length: /.{10,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        special: /[!@#$%^&*(),.?":{}<>]/
    };

    // Update password requirements in real-time
    function updateRequirements() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Check individual requirements
        requirementsList[0].classList.toggle('valid', patterns.length.test(password));
        requirementsList[1].classList.toggle('valid', patterns.uppercase.test(password));
        requirementsList[2].classList.toggle('valid', patterns.lowercase.test(password));
        requirementsList[3].classList.toggle('valid', patterns.special.test(password));
        requirementsList[4].classList.toggle('valid', password === confirmPassword && password !== '');

        // Update icons
        requirementsList.forEach(item => {
            const icon = item.querySelector('i');
            if (item.classList.contains('valid')) {
                icon.className = 'fas fa-check';
            } else {
                icon.className = 'fas fa-times';
            }
        });
    }

    // Validate phone number format
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Validate date format and reality
    function validateDate(date) {
        const dateObj = new Date(date);
        return !isNaN(dateObj.getTime());
    }

    // Validate name (letters only)
    function validateName(name) {
        const nameRegex = /^[A-Za-z]+$/;
        return nameRegex.test(name);
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Add error message to form group
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        // Create or update error message
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        errorMessage.textContent = message;
    }

    // Remove error message from form group
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        let hasError = false;

        // Clear previous errors
        form.querySelectorAll('.form-group').forEach(group => {
            const input = group.querySelector('input');
            removeError(input);
        });

        // Get form data
        const formData = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            password: form.password.value,
            confirmPassword: form.confirmPassword.value,
            dob: form.dob.value,
            phone: form.phone.value.trim()
        };

        // Check for empty fields
        Object.entries(formData).forEach(([key, value]) => {
            const input = form[key];
            if (!value) {
                showError(input, 'This field is required');
                hasError = true;
            }
        });

        if (!hasError) {
            try {
                // Name validation
                if (!validateName(formData.firstName)) {
                    showError(form.firstName, 'Please input a valid First Name (letters only)');
                    hasError = true;
                }
                if (!validateName(formData.lastName)) {
                    showError(form.lastName, 'Please input a valid Last Name (letters only)');
                    hasError = true;
                }

                // Email validation
                if (!validateEmail(formData.email)) {
                    showError(form.email, 'Please input a valid email address');
                    hasError = true;
                }

                // Phone validation
                if (!validatePhoneNumber(formData.phone)) {
                    showError(form.phone, 'Please input a valid phone number (format: 123-456-7890)');
                    hasError = true;
                }

                // Date validation
                if (!validateDate(formData.dob)) {
                    showError(form.dob, 'Please input a valid date');
                    hasError = true;
                }

                // Password validation
                if (!Object.values(patterns).every(pattern => pattern.test(formData.password))) {
                    showError(form.password, 'Password does not meet all requirements');
                    hasError = true;
                }

                // Password match validation
                if (formData.password !== formData.confirmPassword) {
                    showError(form.confirmPassword, 'Passwords do not match');
                    hasError = true;
                }

                if (!hasError) {
                    // Send registration request
                    const response = await fetch('/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Registration failed');
                    }

                    // Registration successful
                    alert('Registration successful! Please login to continue.');
                    window.location.href = '../login_without_user_logged_in/index.html';
                }
            } catch (error) {
                alert(error.message);
            }
        }
    });

    // Input event listeners for real-time validation
    passwordInput.addEventListener('input', updateRequirements);
    confirmPasswordInput.addEventListener('input', updateRequirements);
});
