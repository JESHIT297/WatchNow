// Login Form 1 - Glassmorphism Style JavaScript

class LoginForm1 {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.submitBtn = this.form.querySelector('.login-btn');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.passwordInput = document.getElementById('password');
        this.successMessage = document.getElementById('successMessage');
        this.isSubmitting = false;
        
        this.validators = {
            email: this.validateEmail,
            password: this.validatePassword
        };
        
        this.init();
    }
    
    init() {
        this.addEventListeners();
        this.setupFloatingLabels();
        this.addInputAnimations();
        this.setupPasswordToggle();
        this.setupSocialButtons();
    }
    
    addEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        Object.keys(this.validators).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', () => this.clearError(fieldName));
            }
        });
        
        // Enhanced focus effects
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => this.handleFocus(e));
            input.addEventListener('blur', (e) => this.handleBlur(e));
        });
        
        // Remember me checkbox animation
        const checkbox = document.getElementById('remember');
        if (checkbox) {
            checkbox.addEventListener('change', () => this.animateCheckbox());
        }
        
        // Forgot password link
        const forgotLink = document.querySelector('.forgot-password');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        }
        
        // Sign up link
        const signupLink = document.querySelector('.signup-link a');
        if (signupLink) {
            signupLink.addEventListener('click', (e) => this.handleSignupLink(e));
        }
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }
    
    addInputAnimations() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach((input, index) => {
            // Stagger animation on page load
            setTimeout(() => {
                input.style.opacity = '1';
                input.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    setupSocialButtons() {
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleSocialLogin(e));
        });
    }
    
    handleFocus(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.add('focused');
        }
    }
    
    handleBlur(e) {
        const wrapper = e.target.closest('.input-wrapper');
        if (wrapper) {
            wrapper.classList.remove('focused');
        }
    }
    
    animateCheckbox() {
        const checkmark = document.querySelector('.checkmark');
        if (checkmark) {
            checkmark.style.transform = 'scale(0.8)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 150);
        }
    }
    
    handleForgotPassword(e) {
        e.preventDefault();
        // Add subtle animation
        const link = e.target;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        
        this.showNotification('Password reset link would be sent to your email', 'info');
    }
    
    handleSignupLink(e) {
        e.preventDefault();
        // Add subtle animation
        const link = e.target;
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = 'scale(1)';
        }, 150);
        
        // Show registration modal
        this.showRegistrationModal();
    }
    
    showRegistrationModal() {
        // Create modal HTML
        const modalHTML = `
            <div id="registrationModal" class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Crear Cuenta</h2>
                        <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <form id="registrationForm" class="registration-form">
                        <div class="form-group">
                            <input type="text" id="regName" name="name" required>
                            <label for="regName">Nombre Completo</label>
                            <span class="error-message" id="regNameError"></span>
                        </div>
                        <div class="form-group">
                            <input type="email" id="regEmail" name="email" required>
                            <label for="regEmail">Email</label>
                            <span class="error-message" id="regEmailError"></span>
                        </div>
                        <div class="form-group">
                            <input type="password" id="regPassword" name="password" required>
                            <label for="regPassword">Contraseña</label>
                            <span class="error-message" id="regPasswordError"></span>
                        </div>
                        <button type="submit" class="register-btn">Registrarse</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add modal styles
        const modalStyles = `
            <style>
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 30px;
                    width: 90%;
                    max-width: 400px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .modal-header h2 {
                    color: white;
                    margin: 0;
                }
                .close-modal {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                }
                .registration-form .form-group {
                    position: relative;
                    margin-bottom: 20px;
                }
                .registration-form input {
                    width: 100%;
                    padding: 15px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 10px;
                    color: white;
                    font-size: 16px;
                }
                .registration-form label {
                    position: absolute;
                    left: 15px;
                    top: 15px;
                    color: rgba(255, 255, 255, 0.7);
                    transition: all 0.3s ease;
                    pointer-events: none;
                }
                .registration-form input:focus + label,
                .registration-form input:valid + label {
                    top: -10px;
                    left: 10px;
                    font-size: 12px;
                    background: rgba(0, 0, 0, 0.5);
                    padding: 0 5px;
                    border-radius: 3px;
                }
                .register-btn {
                    width: 100%;
                    padding: 15px;
                    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                .register-btn:hover {
                    transform: translateY(-2px);
                }
                .error-message {
                    color: #ff6b6b;
                    font-size: 12px;
                    margin-top: 5px;
                    display: block;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        
        // Handle registration form submission
        const regForm = document.getElementById('registrationForm');
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegistration(e);
        });
    }
    
    async handleRegistration(e) {
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        try {
            const response = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showNotification('Usuario registrado exitosamente. Ahora puedes iniciar sesión.', 'success');
                document.getElementById('registrationModal').remove();
            } else {
                this.showNotification(data.error || 'Error al registrar usuario', 'error');
            }
            
        } catch (error) {
            this.showNotification('Error de conexión', 'error');
        }
    }
    
    handleSocialLogin(e) {
        const btn = e.currentTarget;
        const provider = btn.classList.contains('google-btn') ? 'Google' : 'GitHub';
        
        // Add loading state
        btn.style.transform = 'scale(0.95)';
        btn.style.opacity = '0.8';
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.opacity = '1';
        }, 200);
        
        this.showNotification(`Connecting to ${provider}...`, 'info');
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const isValid = this.validateForm();
        
        if (isValid) {
            await this.submitForm();
        } else {
            this.shakeForm();
        }
    }
    
    validateForm() {
        let isValid = true;
        
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const validator = this.validators[fieldName];
        
        if (!field || !validator) return true;
        
        const result = validator(field.value.trim(), field);
        
        if (result.isValid) {
            this.clearError(fieldName);
            this.showSuccess(fieldName);
        } else {
            this.showError(fieldName, result.message);
        }
        
        return result.isValid;
    }
    
    shakeForm() {
        this.form.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            this.form.style.animation = '';
        }, 500);
    }
    
    async submitForm() {
        this.isSubmitting = true;
        this.submitBtn.classList.add('loading');
        
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Call actual login API
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store user data for future requests
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userName', data.user.name);
                
                // Show success state
                this.showSuccessMessage();
                
                // Redirect based on role
                setTimeout(() => {
                    if (data.user.role === 'administrador') {
                        this.showNotification('Bienvenido Administrador! Redirigiendo...', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboards/admin-dashboard.html';
                        }, 1000);
                    } else {
                        this.showNotification('Bienvenido Usuario! Redirigiendo...', 'success');
                        setTimeout(() => {
                            window.location.href = 'dashboards/user-dashboard.html';
                        }, 1000);
                    }
                }, 2000);
                
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('Login error:', error);
            this.showLoginError(error.message);
        } finally {
            this.isSubmitting = false;
            this.submitBtn.classList.remove('loading');
        }
    }
    
    showSuccessMessage() {
        // Hide form with smooth animation
        this.form.style.opacity = '0';
        this.form.style.transform = 'translateY(-20px)';
        
        // Hide social login and other elements
        const elementsToHide = ['.divider', '.social-login', '.signup-link'];
        elementsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(-20px)';
            }
        });
        
        setTimeout(() => {
            this.form.style.display = 'none';
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) element.style.display = 'none';
            });
            
            this.successMessage.classList.add('show');
            
            // Simulate redirect after success
            setTimeout(() => {
                this.simulateRedirect();
            }, 3000);
        }, 300);
    }
    
    simulateRedirect() {
        // Keep success message visible - don't reset form
        // User data is already stored in localStorage
        console.log('Login successful. User data stored in localStorage.');
    }
    
    showLoginError(message) {
        this.showNotification(message || 'Login failed. Please try again.', 'error');
        
        // Shake the entire card
        const card = document.querySelector('.login-card');
        card.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);
    }
    
    resetForm() {
        this.successMessage.classList.remove('show');
        
        setTimeout(() => {
            // Show form elements again
            const elementsToShow = ['.divider', '.social-login', '.signup-link'];
            this.form.style.display = 'block';
            elementsToShow.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = 'block';
                }
            });
            
            this.form.reset();
            
            // Clear all validation states
            Object.keys(this.validators).forEach(fieldName => {
                this.clearError(fieldName);
            });
            
            // Reset form appearance
            this.form.style.opacity = '1';
            this.form.style.transform = 'translateY(0)';
            
            // Reset other elements
            elementsToShow.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
            
            // Reset floating labels
            const inputs = this.form.querySelectorAll('input');
            inputs.forEach(input => {
                input.classList.remove('has-value');
            });
            
            // Reset password visibility
            if (this.passwordInput) {
                this.passwordInput.type = 'password';
                const eyeIcon = this.passwordToggle?.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.remove('show-password');
                }
            }
        }, 300);
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Enter key submits form if focus is on form elements
            if (e.key === 'Enter' && e.target.closest('#loginForm')) {
                e.preventDefault();
                this.handleSubmit(e);
            }
            
            // Escape key clears errors
            if (e.key === 'Escape') {
                Object.keys(this.validators).forEach(fieldName => {
                    this.clearError(fieldName);
                });
            }
        });
    }
    
    // Validation methods
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            return { isValid: false, message: 'Email is required' };
        }
        if (!emailRegex.test(email)) {
            return { isValid: false, message: 'Please enter a valid email' };
        }
        return { isValid: true };
    }
    
    validatePassword(password) {
        if (!password) {
            return { isValid: false, message: 'Password is required' };
        }
        if (password.length < 6) {
            return { isValid: false, message: 'Password must be at least 6 characters' };
        }
        return { isValid: true };
    }
    
    // Utility methods
    setupFloatingLabels() {
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.value) {
                    input.classList.add('has-value');
                } else {
                    input.classList.remove('has-value');
                }
            });
        });
    }
    
    setupPasswordToggle() {
        if (this.passwordToggle && this.passwordInput) {
            this.passwordToggle.addEventListener('click', () => {
                const type = this.passwordInput.type === 'password' ? 'text' : 'password';
                this.passwordInput.type = type;
                const eyeIcon = this.passwordToggle.querySelector('.eye-icon');
                if (eyeIcon) {
                    eyeIcon.classList.toggle('show-password');
                }
            });
        }
    }
    
    showError(fieldName, message) {
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
        }
    }
    
    clearError(fieldName) {
        const errorElement = document.getElementById(fieldName + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.remove('error');
        }
    }
    
    showSuccess(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('success');
        }
    }
    
    showNotification(message, type) {
        // Simple notification - you can enhance this
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            z-index: 1000;
            background: ${type === 'error' ? '#e74c3c' : type === 'info' ? '#3498db' : '#27ae60'};
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Public methods
    validate() {
        return this.validateForm();
    }
    
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add entrance animation to login card
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.opacity = '0';
        loginCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            loginCard.style.transition = 'all 0.6s ease';
            loginCard.style.opacity = '1';
            loginCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Initialize the login form
    new LoginForm1();
});

// Handle page visibility changes for better UX
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-focus on email field if user returns to page
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName !== 'INPUT') {
            const emailInput = document.querySelector('#email');
            if (emailInput && !emailInput.value) {
                setTimeout(() => emailInput.focus(), 100);
            }
        }
    }
});