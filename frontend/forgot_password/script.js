document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const form = document.getElementById('forgot-password-form');
    const emailInput = document.getElementById('email');
    const resetButton = document.querySelector('.reset-button');

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = message;
    }

    // Remove error message
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = '';
    }

    // Validate email format
    function validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        removeError(emailInput);
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!email) {
            showError(emailInput, 'Email is required');
            return;
        }
        
        if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }

        try {
            // Disable button while processing
            resetButton.disabled = true;
            resetButton.textContent = 'Sending...';

            // Send reset password request
            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send reset link');
            }

            // Show success message
            form.innerHTML = `
                <div style="text-align: center; color: #00ff00;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>Password reset link has been sent to your email.</p>
                    <p style="margin-top: 1rem; font-size: 0.9rem;">
                        Please check your inbox and follow the instructions to reset your password.
                    </p>
                </div>
            `;

        } catch (error) {
            showError(emailInput, error.message);
            resetButton.disabled = false;
            resetButton.textContent = 'Send Reset Link';
        }
    });
}); 