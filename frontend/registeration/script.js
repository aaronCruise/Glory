document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (navbarToggle) {
        navbarToggle.addEventListener('click', () => {
            navbarMenu.classList.toggle('active');
        });
    }

    // Form validation
    const registerForm = document.getElementById('register-form');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const passwordRequirements = document.querySelectorAll('.password-requirements li');

    // Password requirements
    const requirements = [
        { regex: /.{8,}/, message: 'At least 8 characters long' },
        { regex: /[A-Z]/, message: 'At least one uppercase letter' },
        { regex: /[a-z]/, message: 'At least one lowercase letter' },
        { regex: /[0-9]/, message: 'At least one number' },
        { regex: /[^A-Za-z0-9]/, message: 'At least one special character' }
    ];

    // Check password requirements
    function checkPasswordRequirements(password) {
        requirements.forEach((req, index) => {
            const requirement = passwordRequirements[index];
            if (req.regex.test(password)) {
                requirement.classList.add('valid');
            } else {
                requirement.classList.remove('valid');
            }
        });
    }

    // Validate password match
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity('Passwords do not match');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    // Event listeners
    passwordInput.addEventListener('input', () => {
        checkPasswordRequirements(passwordInput.value);
        validatePasswordMatch();
    });

    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // Form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if all password requirements are met
        const password = passwordInput.value;
        const allRequirementsMet = requirements.every(req => req.regex.test(password));

        if (!allRequirementsMet) {
            alert('Please meet all password requirements');
            return;
        }

        // Get form data
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Send registration request
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Registration successful
                window.location.href = '/login.html';
            } else {
                // Handle registration error
                const error = await response.json();
                alert(error.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
